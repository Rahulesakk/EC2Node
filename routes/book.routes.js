const express = require('express')

const router = express.Router();

const fileUpload = require('express-fileupload')
const {createBook} = require("../controllers/book.controller.js")

router.post("/createBook",fileUpload(),createBook)


module.exports = router