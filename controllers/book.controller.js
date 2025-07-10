const Book = require('../models/book.model')
const {putObject} = require("../utils/putObject")

exports.createBook = async (req,res)=>{
    try{
        // console.log("HI")
        // return
        const {name,author} = req.body
        const {files} = req.files
        console.log(req.files)
        const filename = `${Date.now()}-${files.name}`

        const {url,key} = await putObject(files,filename)
        let book={
            bookName:name,
            bookAuthor:author,
            imageUrl:url,
            key:key
        }
        let data = await Book.create(book)

        return res.status(200).json({
            data,
        })
        




    }
    catch(err){
        console.log('Books Controller error',err)
        return res.status(500).json({
            message:"Interbal Server Error"
        })
    }
}