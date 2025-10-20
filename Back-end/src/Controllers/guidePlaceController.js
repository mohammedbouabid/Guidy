// controllers/guidePlaceController.js
import GuidePlace from "../Models/Guideplace.js";
// import { v2 as CloundinaryConfig } from "cloudinary";


// Créer un lieu avec upload
export const createGuidePlace = async (req, res) => {
  try {
    // Récupérer les URLs des images uploadées sur Cloudinary
    const imageUrls = req.files?.map((file) => file.path) || [];

    if (imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "Au moins une image est requise" });
    }

    const data = {
      ...req.body,
      images: imageUrls,
      guideID: "68e2827f66a82c966fa0bfe4",
    };

    const newPlace = await GuidePlace.create(data);
    res.status(201).json({ message: "Lieu créé avec succès", data: newPlace });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer tous les lieux avec les informations du guide
export const getAllGuidePlaces = async (req, res) => {
  try {
    const places = await GuidePlace.find().populate({
      path: "guideID",
      select: "firstName lastName email profileImage role", // Sélectionnez les champs dont vous avez besoin
    });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer un lieu par ID avec les informations du guide
export const getGuidePlaceById = async (req, res) => {
  try {
    const place = await GuidePlace.findById(req.params.id).populate({
      path: "guideID",
      select: "firstName lastName email profileImage role",
    });
    if (!place) return res.status(404).json({ message: "Lieu non trouvé ❌" });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre à jour un lieu (avec images optionnelles)
// controllers/guidePlaceController.js

export const updateGuidePlace = async (req, res) => {
  try {
    const { existingImages } = req.body;

    const existingPlace = await GuidePlace.findOne({
      _id: req.params.id,
      guideID: "68e2827f66a82c966fa0bfe4",
    });

    if (!existingPlace) {
      return res.status(404).json({
        message:
          "Lieu non trouvé ou vous n'avez pas les droits pour le modifier",
      });
    }

    // Convertir existingImages si c'est une string
    let keptImages = [];
    if (existingImages) {
      keptImages = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }

    // Ajouter les nouvelles images (uploadées via multer/cloudinary)
    const newUploadedImages = req.files?.map((file) => file.path) || [];

    // Combiner les images restantes et les nouvelles
    const finalImages = [...keptImages, ...newUploadedImages];

    if (finalImages.length === 0) {
      return res
        .status(400)
        .json({ message: "Au moins une image est requise" });
    }

    const updatedData = {
      ...req.body,
      images: finalImages,
    };

    const updated = await GuidePlace.findOneAndUpdate(
      { _id: req.params.id, guideID: "68e2827f66a82c966fa0bfe4" },
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Lieu mis à jour avec succès",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

//  Supprimer un lieu et ses images
export const deleteGuidePlace = async (req, res) => {
  try {
    const place = await GuidePlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    // for (const imageUrl of place.images) {
    //   // 🧩 Extraire le public_id de l’image à partir de son URL
    //   const publicId = imageUrl.split("/").pop().split(".")[0];
    //   await CloundinaryConfig.uploader.destroy(publicId);
    // }
    // Delete from database
    await GuidePlace.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Place deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
