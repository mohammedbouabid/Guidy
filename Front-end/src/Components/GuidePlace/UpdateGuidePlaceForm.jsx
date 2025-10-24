import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { updatePack, fetchPackById } from '../../store/slices/packSlice';
import { fetchGuidePlaces } from '../../store/slices/guidePlaceSlice';
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
  const { places, loading: placesLoading } = useSelector((state) => state.guidePlace);
  const { current: pack, loading: packLoading } = useSelector((state) => state.pack);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    startDate: '',
    endDate: '',
    startLocation: '',
    endLocation: '',
    maxClients: '',
    availability: true,
  });
  
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newPreview, setNewPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing pack data
  useEffect(() => {
    dispatch(fetchGuidePlaces());
    dispatch(fetchPackById(id))
      .unwrap()
      .then((p) => {
        setFormData({
          title: p.title || '',
          description: p.description || '',
          price: p.price ?? '',
          startDate: p.startDate ? new Date(p.startDate).toISOString().slice(0, 10) : '',
          endDate: p.endDate ? new Date(p.endDate).toISOString().slice(0, 10) : '',
          availability: Boolean(p.availability),
          startLocation: p.startLocation || '',
          endLocation: p.endLocation || '',
          maxClients: p.maxClients ?? '',
        });
        setSelectedPlaces(Array.isArray(p.guidesPlacesId) ? p.guidesPlacesId.map(String) : []);
        setExistingImage(p.profileImg || '');
      })
      .catch((e) => {
        toast.error(e?.message || 'Failed to load pack');
      });
  }, [dispatch, id]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (!formData.startLocation) {
      newErrors.startLocation = 'Start location is required';
    }
    
    if (!formData.endLocation) {
      newErrors.endLocation = 'End location is required';
    }
    
    if (!formData.maxClients || Number(formData.maxClients) <= 0) {
      newErrors.maxClients = 'Max clients must be a positive number';
    }
    
    if (selectedPlaces.length === 0) {
      newErrors.guidesPlacesId = 'Select at least one place';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSelectPlace = (pid) => {
    setSelectedPlaces(prev => prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]);
    if (errors.guidesPlacesId) {
      setErrors(prev => ({ ...prev, guidesPlacesId: '' }));
    }
  };

  const onNewImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewPreview(URL.createObjectURL(file));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  const formDataToSend = new FormData();

  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('price', String(formData.price));
  formDataToSend.append('startDate', formData.startDate);
  formDataToSend.append('endDate', formData.endDate);
  formDataToSend.append('startLocation', formData.startLocation);
  formDataToSend.append('endLocation', formData.endLocation);
  formDataToSend.append('maxClients', String(formData.maxClients));
  formDataToSend.append('availability', String(formData.availability));
  
  selectedPlaces.forEach(pid => {
    formDataToSend.append('guidesPlacesId', pid);
  });
  
  if (newImageFile) {
    formDataToSend.append('profileImg', newImageFile);
  }

  try {
    await dispatch(updatePack({ id, formData: formDataToSend })).unwrap();
    toast.success('Pack updated successfully!');
    navigate('/guide/places');
  } catch (error) {
    toast.error(error?.message || 'Failed to update pack');
    setErrors(error?.errors || {});
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Update Pack</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {existingImage && !newPreview && (
                <div className="relative group">
                  <img src={existingImage} alt="Current" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setExistingImage('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
              {newPreview && (
                <div className="relative group">
                  <img src={newPreview} alt="New" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setNewImageFile(null); setNewPreview(''); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
              {!newPreview && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#EB662B] transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Replace Photo</span>
                  <input type="file" accept="image/*" onChange={onNewImage} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter pack title"
                className={inputStyles(errors.title)}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1.5">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className={inputStyles(errors.price)}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1.5">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={inputStyles(errors.startDate)}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1.5">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={inputStyles(errors.endDate)}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1.5">{errors.endDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Start Location
              </label>
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleInputChange}
                placeholder="Enter start location"
                className={inputStyles(errors.startLocation)}
              />
              {errors.startLocation && (
                <p className="text-sm text-red-500 mt-1.5">{errors.startLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                End Location
              </label>
              <input
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleInputChange}
                placeholder="Enter end location"
                className={inputStyles(errors.endLocation)}
              />
              {errors.endLocation && (
                <p className="text-sm text-red-500 mt-1.5">{errors.endLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Max Clients
              </label>
              <input
                type="number"
                name="maxClients"
                value={formData.maxClients}
                onChange={handleInputChange}
                placeholder="Enter max clients"
                className={inputStyles(errors.maxClients)}
              />
              {errors.maxClients && (
                <p className="text-sm text-red-500 mt-1.5">{errors.maxClients}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input 
                id="availability" 
                type="checkbox" 
                name="availability" 
                checked={formData.availability} 
                onChange={handleInputChange} 
                className="h-4 w-4 text-[#EB662B]" 
              />
              <label htmlFor="availability" className="text-sm font-medium text-gray-700">Available</label>
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
              placeholder="Enter pack description"
              rows="4"
              className={`${inputStyles(errors.description)} resize-none`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1.5">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guide Places</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-auto p-2 border rounded-xl">
              {(places || []).map((p) => (
                <label key={p._id} className={`flex items-center gap-3 p-3 rounded-lg border ${selectedPlaces.includes(p._id) ? 'border-[#EB662B] bg-orange-50' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={selectedPlaces.includes(p._id)} onChange={() => onSelectPlace(p._id)} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-gray-500 text-xs">{p.city}, {p.country}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.guidesPlacesId && <p className="text-sm text-red-500 mt-1">{errors.guidesPlacesId}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/guide/places')}
              className="px-6 py-2.5 cursor-pointer text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-white cursor-pointer bg-[#EB662B] rounded-lg hover:bg-[#d55a26] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Pack'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}