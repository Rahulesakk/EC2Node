const express = require('express')
const cluster = require('cluster')
const os = require('os')
require('dotenv').config();
const BookRoutes = require("./routes/book.routes")
const connectMongoDB = require("../my-node-server/utils/database")

const numCpus = os.cpus().length

if(cluster.isPrimary){
    for(let i =0;i<numCpus;i++){
        cluster.fork()
    }
}
else{
    const app = express();
    app.use(express.json());
    connectMongoDB()
    app.get("/",(req,res)=>{
        res.send(`Hello From Express ${process.pid}`)
    })
    app.use("/api",BookRoutes);
    const Port = process.env.PORT||8000
    app.listen(Port,()=>{
        console.log(`Worker PID: ${process.pid} listening on port ${Port}`)
    })
}
