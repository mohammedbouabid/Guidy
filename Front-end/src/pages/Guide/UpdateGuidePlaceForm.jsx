import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { updateGuidePlace } from '../../store/slices/guidePlaceSlice';
import { toast } from 'sonner';

const inputStyles = (error) => `
  w-full px-4 py-3 rounded-lg bg-gray-50 
  ${error ? 'border-2 border-red-500' : 'border-transparent'} 
  outline-none transition-all duration-200
  focus:ring-2 focus:ring-[#EB662B] focus:bg-white
  placeholder:text-gray-400
`;

export default function UpdateGuidePlaceForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { places, loading } = useSelector((state) => state.guidePlace);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    country: '',
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing place data
  useEffect(() => {
    const place = places.find(p => p._id === id);
    if (place) {
      setFormData({
        name: place.name,
        description: place.description,
        location: place.location,
        city: place.city,
        country: place.country,
      });
      setExistingImages(place.images);
    }
  }, [id, places]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (existingImages.length === 0 && newImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length + existingImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setNewImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
    setPreviewImages(prev => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    
    // Append form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // Append existing images
    existingImages.forEach(image => {
      formDataToSend.append('existingImages', image);
    });
    
    // Append new images
    newImages.forEach(image => {
      formDataToSend.append('images', image);
    });

    try {
      await dispatch(updateGuidePlace({ id, formData: formDataToSend })).unwrap();
      toast.success('Place updated successfully!');
      navigate('/guide/places');
    } catch (error) {
      toast.error(error?.message || 'Failed to update place');
      setErrors(error?.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Update Place</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Sections */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Current Photos</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group aspect-square">
                  <img 
                    src={image}
                    alt={`Current ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Add New Photos</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previewImages.map((preview, index) => (
                <div key={`new-${index}`} className="relative group aspect-square">
                  <img 
                    src={preview}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
              {(existingImages.length + newImages.length) < 10 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#EB662B] transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {errors.images && (
              <p className="text-sm text-red-500 mt-1">{errors.images}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter place name"
                className={inputStyles(errors.name)}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1.5">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                className={inputStyles(errors.location)}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1.5">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city name"
                className={inputStyles(errors.city)}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1.5">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country name"
                className={inputStyles(errors.country)}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1.5">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter place description"
              rows="4"
              className={`${inputStyles(errors.description)} resize-none`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1.5">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/guide/places')}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-white bg-[#EB662B] rounded-lg hover:bg-[#d55a26] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Place'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}