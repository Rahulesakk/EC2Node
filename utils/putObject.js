const {s3Client} = require('./s3.credeantils')
const {PutObjectCommand } = require("@aws-sdk/client-s3")

exports.putObject = async(file,filename) =>{
    try{
        const params ={
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${filename}`,
            Body:file.data,
            ContentType:file.mimetype,
            ContentLength:file.size,
            //  ACL: 'public-read',
        }
        // console.log(params)
       await s3Client.send(new PutObjectCommand(params));

        let url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
        console.log(url)
        return {url,key:params.Key}

    }catch(err){
        console.log(err)
    }
}