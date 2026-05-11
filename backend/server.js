import express from 'express';
import 'dotenv/config'
import connectDB from './database/db.js';
import dns from 'dns'
import userRoute from './routes/userRoutes.js'
import cors from "cors"

dns.setServers(["1.1.1.1", "8.8.8.8"])

const app= express()
const PORT= process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:`http://localhost:5173`,
    credentials:true
}))

app.use('/api/v1/user',userRoute)

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is listening at port ${PORT}`)
})