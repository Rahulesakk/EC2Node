const bcrypt = require("bcryptjs");
const User = require('../models/user.model.js')
const { generateToken } =require('../lib/utils.js')
const {putObject} = require("../utils/putObject")

module.exports.signup = async (req,res) => {
    const {fullName,email,password} = req.body
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be attleat Characters"})
        }
        const user = await User.findOne({email})

        if(user) {
            return res.status(400).json({message:"Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                Profile:newUser.profilePic
            })
        }else{
            return res.status(400).json({message:"Invalid User Data"})
        }
    }catch(err){
        console.log(`Error in signup controller ${err}`)
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports.login = async (req,res) =>{
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
             return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    }catch(err){
        console.log(`Error in login Controller ${err}`)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
module.exports.logout = async (req,res) =>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Looged out Successfully"})
    }catch(err){
        console.log(`Error in Logout Controller ${err}`)
        res.status(500).json({message:"Internal Server Error"})
    }
}
module.exports.checkAuth = (req,res) =>{
    try{
         res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.updateProfile = async (req,res) =>{
    try{
        const userId = req.user._id
        console.log(req.files,"dddddddddddd")
        const {file} = req.files
        if(!file){
            return res.status(400).json({message:"Profile Pic is Required!"})
        }
        const filename = `${Date.now()}-${file.name}`
        const {url,key} = await putObject(file,filename)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: url },
            { new: true }
            );

    res.status(200).json(updatedUser);

    }catch(error){
        console.log('error in the updateProfile controller',error)
        res.status(500).josn({message:"Internal Server Error"})
    }
}