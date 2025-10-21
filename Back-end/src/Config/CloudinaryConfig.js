import { v2 as CloundinaryConfig } from "cloudinary";

import dotenv from "dotenv";

dotenv.config(); // Charge les variables d'environnement


CloundinaryConfig.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_AMINE,
  api_key: process.env.CLOUDINARY_API_KEY_AMINE,
  api_secret: process.env.CLOUDINARY_API_SECRET_AMINE,
});


export default CloundinaryConfig       