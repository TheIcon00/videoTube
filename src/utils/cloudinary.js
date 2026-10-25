import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINADRY_CLOUD_NAME, 
        api_key: process.env.CLOUDINADRY_API_KEY, 
        api_secret: process.env.CLOUDINADRY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
 
const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath)return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        // console.log("file is uploaded on cloudinary",response.url);
        // return response;
        fs.unlinkSync(localFilePath)
        return response;


    }
    catch(error){
        fs.unlinkSync(localFilePath)
        return null;


    }
}
export {uploadOnCloudinary}