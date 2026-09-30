
/* Non-Modular Approach (of connecting App to DB) :

import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from "express"
const app = express()

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", ()=>{
            console.log("ERROR: ",error)
            throw err
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App listening on port: ${process.env.PORT}`)
        })
    }
    catch(myErr){
        console.error("ERROR: ",myErr)
        throw myErr
    }
})()

*/

// ---------------------------------------------------------------------------------------------------------------------------
// MODULAR APPROACH :

import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({path:"./env"})
const port = process.env.PORT || 8000

connectDB()
.then(() => {
    app.on("error",(err)=>{
        console.log("ERROR: ",err)
        throw err
    })

    app.listen(port, ()=>{
        console.log("Server Listening on Port :",port);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error !!!",err);
})

