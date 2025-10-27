import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/CloudinaryConfig.js";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "GuidePlace",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${Date.now()}_${file.originalname}`,
      resource_type: "image",
      overwrite: true,
    };
  },
});

// Configure multer with limits
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, //    10MB limit per file
    files: 10, // Maximum number of files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed!"), false);
      return;
    }
    cb(null, true);
  },
});

// Error handling middleware
export const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 10MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Maximum is 10 files",
      });
    }
  }
  next(error);
};

export default upload;