import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "user_profiles",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}_${req.user.id}`,
      resource_type: "image",
      overwrite: true,
    };
  },
});

const upload = multer({ storage });

export default upload;
