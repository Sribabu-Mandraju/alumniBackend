import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: "de7iuajgf",
    api_key:"537811181139663" ,
    api_secret: "T9Ir5FZ_0sMHRy2kCDa6iFDpYmw"
});

export default cloudinary;
