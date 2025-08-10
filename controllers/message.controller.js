// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";
const Message = require("../models/message.model")
const User = require('../models/user.model')
const { getReceiverSocketId, io } = require("../lib/socket.js")

module.exports.getUSerForSideBar = async (req,res) =>{
    try{
        const loggedInUserId = req.user._id
        const FilterdUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        res.status(200).json(FilterdUser)
    }catch(error){
         console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.getMessage = async (req,res) =>{
    try{
        const {id:userToChatId} = req.params
        const myid = req.user._id

        
        const messages = await Message.find({
            $or:[
                {senderId:myid,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myid}
            ]
        })
        res.status(200).json(messages)
    }catch(error){
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.sendMessage  = async (req,res) =>{
    try{
        const {text} = req.body
        const { id: receiverId } = req.params;
        const senderId= req.user._id 

        const newMessage = new Message({
            senderId,
            receiverId,
            text
        })
        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
    }catch(error){
        console.log('Error in sendMessage Controller',error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}
