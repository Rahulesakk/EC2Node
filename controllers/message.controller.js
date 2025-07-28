// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";
const Message = require("../models/message.model")
const User = require('../models/user.model')

module.exports.getUSerForSideBar = async (req,res) =>{
    try{
        const loggedInUserId = req.user._id
        const FilterdUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        res.status(200).json(FilterdUser)
    }catch(err){
         console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
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
    }catch(err){
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}