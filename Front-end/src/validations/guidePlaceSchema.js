import { z } from "zod";

export const guidePlaceSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  location: z.string()
    .min(3, "Location must be at least 3 characters"),
  city: z.string()
    .min(2, "City must be at least 2 characters"),
  country: z.string()
    .min(2, "Country must be at least 2 characters"),
  images: z.array(z.any())
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});