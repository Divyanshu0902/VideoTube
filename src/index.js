

// MODULAR APPROACH :

import connectDB from "./db/index.js"
import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({path:"./.env"})
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



// ---------------------------------------------------------------------------------------------------------------------------
