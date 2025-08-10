const express = require('express')
const cluster = require('cluster')
const os = require('os')
const cors = require('cors')
var morgan = require('morgan')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const BookRoutes = require("./routes/book.routes")
const AuthRoutes = require("./routes/auth.routes")
const MessageRoutes = require("./routes/message.route")
const connectMongoDB = require("./utils/database")
const { app, server } = require("./lib/socket")

const numCpus = os.cpus().length

// if(cluster.isPrimary){
//     for(let i =0;i<numCpus;i++){
//         cluster.fork()
//     }
// }
// else{
    // const app = express();
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
    app.use(morgan('dev'))
    app.use(express.json());
     app.use(cookieParser());
    
   
    connectMongoDB()
    app.get("/",(req,res)=>{
        res.send(`Hello From Express ${process.pid}`)
    })
    app.use("/api",BookRoutes);
    app.use("/api/auth",AuthRoutes);
    app.use("/api/messages",MessageRoutes)
    const Port = process.env.PORT||8000
    server.listen(Port,()=>{
        console.log(`server listening on port ${Port}`)
    })
// }
