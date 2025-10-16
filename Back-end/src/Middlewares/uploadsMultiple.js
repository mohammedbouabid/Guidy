import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/CloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "GuidePlace",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}_${file.originalname}`,
      resource_type: "image",
      overwrite: true,
    };
  },
});

const upload = multer({ storage });

export default upload;