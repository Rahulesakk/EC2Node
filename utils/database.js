const {  mongoose } = require("mongoose");

const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected To mongodb EC2')
    }catch(err){
        console.error('Connection Error',err)
    }
}


module.exports = connectMongoDB