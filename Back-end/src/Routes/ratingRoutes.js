import express from "express";
import {
  addRating, 
  updateRating, 
  getAllRatings, 
  getRatingsByPack, 
  deleteRating,
  getRatingById
} from '../Controllers/ratingController.js'
import { verifyToken } from "../Middlewares/verifyJwtToken.js";
import { authorizeRoles } from "../Middlewares/authorizeRole.js";
import { addRatingValidation, updateRatingValidation } from "../Validations/ratingValidator.js";
import { validate } from "../Middlewares/userValidate.js";
import { requireProfileCompletion } from "../Middlewares/requireProfileFields.js";

const router = express.Router();

// Get all ratings (no params)
router.get('/rating', verifyToken, authorizeRoles(["admin", "client", "guide"]), getAllRatings)

// Get ratings by pack (specific path)
router.get('/rating/pack/:packId', verifyToken, authorizeRoles(["admin", "client","guide"]), getRatingsByPack)

// Get single rating by ID (specific path to avoid conflict)
router.get('/rating/details/:id', verifyToken, authorizeRoles(["admin", "client", "guide"]), getRatingById)

// Create rating
router.post('/rating', verifyToken, authorizeRoles(["client"]), requireProfileCompletion, addRatingValidation, validate, addRating)

// Update rating
router.put('/rating/:id', verifyToken, authorizeRoles(["client"]), updateRatingValidation, validate, updateRating)

// Delete rating
router.delete('/rating/:id', verifyToken, authorizeRoles(["admin", "client"]), deleteRating)

export default router;