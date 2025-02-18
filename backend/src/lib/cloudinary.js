import {v2 as cloudinary} from "cloudinary"
import {config} from "dotenv" //to access the cloudinary cloud name and api and secret key from the env file we use this config function from dotenv package
config();


//instance created
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY,
})


export default cloudinary;
