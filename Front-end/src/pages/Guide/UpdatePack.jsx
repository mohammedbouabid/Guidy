import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { fetchGuidePlaces } from '@/store/slices/guidePlaceSlice';
import { fetchPackById, updatePack } from '@/store/slices/packSlice';
import { toast } from 'react-hot-toast';
import { validatePackForm, clearFieldError } from '@/validations/packValidation';

const inputStyles = (error) => `
  w-full px-4 py-3 rounded-lg bg-gray-50 
  ${error ? 'border-2 border-red-500' : 'border-transparent'} 
  outline-none transition-all duration-200
  focus:ring-2 focus:ring-[#EB662B] focus:bg-white
  placeholder:text-gray-400
`;

export default function UpdatePack() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { places } = useSelector((s) => s.guidePlace);
  const { current, loading } = useSelector((s) => s.pack);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    startDate: '',
    endDate: '',
    availability: true,
    startLocation: '',
    endLocation: '',
    maxClients: '',
  });
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newPreview, setNewPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchGuidePlaces());
    dispatch(fetchPackById(id))
      .unwrap()
      .then((p) => {
        setForm({
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

  const validate = () => {
    const validationErrors = validatePackForm(form, selectedPlaces, newImageFile, true);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(clearFieldError(errors, name));
  };

  const onSelectPlace = (pid) => {
    setSelectedPlaces((prev) => prev.includes(pid) ? prev.filter((i) => i !== pid) : [...prev, pid]);
    if (errors.guidesPlacesId) setErrors(clearFieldError(errors, 'guidesPlacesId'));
  };

  const onNewImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('price', String(form.price));
    fd.append('startDate', form.startDate);
    fd.append('endDate', form.endDate);
    fd.append('availability', String(form.availability));
    fd.append('startLocation', form.startLocation);
    fd.append('endLocation', form.endLocation);
    fd.append('maxClients', String(form.maxClients));
    selectedPlaces.forEach((pid) => fd.append('guidesPlacesId', pid));
    if (newImageFile) fd.append('profileImg', newImageFile);

    try {
      await dispatch(updatePack({ id, formData: fd })).unwrap();
      toast.success('Pack updated successfully');
      navigate('/guide/PacksGuide');
    } catch (err) {
      toast.error(err?.message || 'Failed to update pack');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Update Pack</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Title</label>
              <input name="title" value={form.title} onChange={onChange} placeholder="Pack title" className={inputStyles(errors.title)} />
              {errors.title && <p className="text-sm text-red-500 mt-1.5">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Price</label>
              <input type="number" name="price" value={form.price} onChange={onChange} placeholder="Price" className={inputStyles(errors.price)} />
              {errors.price && <p className="text-sm text-red-500 mt-1.5">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={onChange} className={inputStyles(errors.startDate)} />
              {errors.startDate && <p className="text-sm text-red-500 mt-1.5">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={onChange} className={inputStyles(errors.endDate)} />
              {errors.endDate && <p className="text-sm text-red-500 mt-1.5">{errors.endDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Start Location</label>
              <input name="startLocation" value={form.startLocation} onChange={onChange} placeholder="Start location" className={inputStyles(errors.startLocation)} />
              {errors.startLocation && <p className="text-sm text-red-500 mt-1.5">{errors.startLocation}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">End Location</label>
              <input name="endLocation" value={form.endLocation} onChange={onChange} placeholder="End location" className={inputStyles(errors.endLocation)} />
              {errors.endLocation && <p className="text-sm text-red-500 mt-1.5">{errors.endLocation}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Max Clients</label>
              <input type="number" name="maxClients" value={form.maxClients} onChange={onChange} placeholder="Max clients" className={inputStyles(errors.maxClients)} />
              {errors.maxClients && <p className="text-sm text-red-500 mt-1.5">{errors.maxClients}</p>}
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input id="availability" type="checkbox" name="availability" checked={form.availability} onChange={onChange} className="h-4 w-4 text-[#EB662B]" />
              <label htmlFor="availability" className="text-sm font-medium text-gray-700">Available</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Pack description" rows="4" className={`${inputStyles(errors.description)} resize-none`} />
            {errors.description && <p className="text-sm text-red-500 mt-1.5">{errors.description}</p>}
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

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/guide/PacksGuide')} className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-white cursor-pointer bg-[#EB662B] rounded-lg hover:bg-[#d55a26] transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? (<><Loader2 className="w-4 h-4 animate-spin" />Updating...</>) : 'Update Pack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
