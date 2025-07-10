const  mongoose  = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName:{
        type:String,
        required:true,
    },
    bookAuthor:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    }
    
},
{
    timestamps:true,
},
)

module.exports = mongoose.model("Book",bookSchema)
