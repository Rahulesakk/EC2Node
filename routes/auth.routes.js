const express = require('express')
// // const {
// //     checkAuth,login,logout,signup
// // } = require('../controllers/auth.controller')

const {checkAuth,login,logout,signup,updateProfile} =require('../controllers/auth.controller')
const { protectRoute } = require('../middleware/auth.middleware')
const fileUpload = require('express-fileupload')
const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile",fileUpload(),protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth);
module.exports= router
