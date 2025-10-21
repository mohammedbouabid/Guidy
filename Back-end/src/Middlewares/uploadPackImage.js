// src/Middlewares/uploadPackImage.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

// 🗂️ Configure storage for PACK images
const packImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "pack_images",                     // <— folder name for Pack images
    allowed_formats: ["jpg", "jpeg", "png"],   // allowed file types
    public_id: `${Date.now()}_${req.user.id}`,
           // unique Cloudinary public ID
    resource_type: "image",
  }),
});

// 🧩 Create multer instance
const uploadPackImage = multer({ storage: packImageStorage });

export default uploadPackImage;
