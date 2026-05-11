import { User } from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import verifyEmail from "../emailVerify/verifyEmail.js"
import { session } from "../models/sessionModel.js"
import sendOTPMail from "../emailVerify/sendOTPMail.js"

export const register= async(req,res)=>{
    try{
        const {firstName, lastName, email, password}= req.body
        if(!firstName || !lastName || !email || !password){
            res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user= await User.findOne({email})
        if(user){
            res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword= await bcrypt.hash(password, 10)
        const newUser= await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        })

        const token =jwt.sign({id:newUser._id}, process.env.SECRET_KEY, {expiresIn:'10m'})
        verifyEmail(token, email)
        newUser.token= token
        await newUser.save()
        return res.status(201).json({
            success:true,
            message:"user registered successfully",
            user:newUser
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization token is missing or invalid"
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        user.token = null;
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        );
        verifyEmail(token, email);
        user.token = token;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Verification email sent again successfully",
            token: user.token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
export const login = async(req,res)=>{
    try{
        const {email,password}= req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User not exist"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        if(existingUser.isVerified===false){
            return res.status(400).json({
                success:false,
                message:"Verify your account then login"
            })
        }

        const accessToken = jwt.sign({id:existingUser._id}, process.env.SECRET_KEY, {expiresIn:"10d"})
        const refreshToken = jwt.sign({id:existingUser._id}, process.env.SECRET_KEY, {expiresIn:"30d"})

        existingUser.isLoggedin= true
        await existingUser.save()

        const existingSession = await session.findOne({userId:existingUser._id})
        if(existingSession){
            await session.deleteOne({userId:existingUser._id})
        }

        await session.create({userId:existingUser._id})
        return res.status(200).json({
            success:true,
            message:`Welcome back ${existingUser.firstName}`,
            user:existingUser,
            accessToken,
            refreshToken
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
export const logout= async(req,res)=>{
    try{
        const userId= req.id
        await session.deleteMany({userId:userId})
        await User.findByIdAndUpdate(userId, {isLoggedin:false})
        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
// export const forgotPassword= async(req,res)=>{
//     try{
//         const {email}= req.body
//         const user= await User.findOne({email})
//         if(!user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
//         const otp= Math.floor(100000+ Math.random()*900000).toString()
//         const otpExpiry= new Date(Date.now()+10*60*1000)
//         user.otp= otp
//         user.otpExpiry= otpExpiry

//         await user.save()
//         await sendOTPMail(otp,email)

//         return res.status(200).json({
//             success:true,
//             message:"Otp sent to email successfully"
//         })
//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
// export const verifyOTP= async(req,res)=>{
//     try{
//         const {otp}= req.body
//         const email= req.params.email
//         if(!otp){
//             return res.status(400).json({
//                 success:false,
//                 message:"Otp is required"
//             })
//         }
//         const user= await User.findOne({email})
//         if(!user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
//         if(!user.otp || !user.otpExpiry){
//             return res.status(400).json({
//                 success:false,
//                 message:"Otp is not generated or verified"
//             })
//         }
//         if(user.otpExpiry< new Date()){
//             return res.status(400).json({
//                 success:false,
//                 message:"Otp expired please request a new one"
//             })
//         }
//         if(otp !== user.otp){
//             return res.status(400).json({
//                 success:false,
//                 message:"Otp is invalid"
//             })
//         }
//         user.otp= null
//         user.otpExpiry= null
//         await user.save()

//         return res.status(200).json({
//             success:true,
//             message:"Otp verified successfully"
//         })
//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
// export const changePassword= async(req,res)=>{
//     try{
//         const {newPassword, confirmPassword}= req.body
//         const email= req.params.email
//         const user= await User.findOne({email})
//         if(!user){
//             return res.status(400).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
//         if(!newPassword || !confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"All fields are required"
//             })
//         }
//         if(newPassword!== confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"Password do not match"
//             })
//         }
//         const hashedPassword= bcrypt.hash(newPassword,10)
//         user.password= hashedPassword
//         await user.save()
//         return res.status(200).json({
//             success:true,
//             message:"Password changed successfully"
//         })
//     }catch(err){
//         return res.status(400).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()
        await sendOTPMail(otp, email)

        return res.status(200).json({
            success: true,
            message: "OTP sent to email successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body  
        const email= req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP are required"
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP not generated, please request a new one"
            })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired, please request a new one"
            })
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body 
        const email= req.params.email
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            })
        }
        if (newPassword !== confirmPassword) {     
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10) 
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message   
        })
    }
}
export const allUser= async(req,res)=>{
    try {
        const users= await User.find()
        return res.status(200).json({
            success: true,
            users
        })
    } catch(err){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
export const getUserByid= async(req,res)=>{
    try {
        const {userId}= req.params;
        const user= await User.findById(userId).select("-password -otp -otpExpiry -token")
        if(!user){
            return res.status(404).json({
               success:false,
               message:"User not found"
            }) 
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}