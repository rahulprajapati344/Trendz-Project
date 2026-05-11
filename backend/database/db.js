import mongoose from 'mongoose'
import 'dotenv/config'

const connectDB= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected")
    }catch(err){
        console.log("MongoDB connection failed -> ",err)
    }
}

export default connectDB;