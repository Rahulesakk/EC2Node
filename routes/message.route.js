const express = require('express')
const { protectRoute } = require('../middleware/auth.middleware.js')
const { getMessage,getUSerForSideBar,sendMessage } =require('../controllers/message.controller.js')

const router = express.Router()


router.get("/users", protectRoute, getUSerForSideBar);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id",protectRoute,sendMessage)


module.exports = router
