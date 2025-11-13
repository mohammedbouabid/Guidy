import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Loader2, X, Search, MapPin, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGuidePlacesForGuide } from '@/store/slices/guidePlaceSlice';
import { createPack } from '@/store/slices/packSlice';
import { toast } from 'react-hot-toast';

const inputStyles = (error) => `
  w-full px-4 py-3 rounded-lg bg-gray-50 
  ${error ? 'border-2 border-red-500' : 'border-transparent'} 
  outline-none transition-all duration-200
  focus:ring-2 focus:ring-[#EB662B] focus:bg-white
  placeholder:text-gray-400
`;

export default function AddPack() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { placesForGuide, loading: placesLoading } = useSelector((s) => s.guidePlace);
  const { loading: packLoading } = useSelector((s) => s.pack);

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByCountry, setFilterByCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(fetchGuidePlacesForGuide());
  }, [dispatch]);

  // Filtrer les places selon la recherche et le pays
  const filteredPlaces = useMemo(() => {
    if (!placesForGuide) return [];
    
    return placesForGuide.filter((place) => {
      const matchesSearch = 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCountry = 
        filterByCountry === 'all' || place.country === filterByCountry;
      
      return matchesSearch && matchesCountry;
    });
  }, [placesForGuide, searchQuery, filterByCountry]);

  // Pagination
  const totalPages = Math.ceil(filteredPlaces.length / ITEMS_PER_PAGE);
  const paginatedPlaces = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPlaces, currentPage]);

  // Réinitialiser la page lors du changement de recherche/filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterByCountry]);

  // Obtenir la liste des pays uniques
  const countries = useMemo(() => {
    if (!placesForGuide) return [];
    return [...new Set(placesForGuide.map((p) => p.country))];
  }, [placesForGuide]);

  // Obtenir les places sélectionnées avec leurs détails
  const selectedPlacesDetails = useMemo(() => {
    if (!placesForGuide) return [];
    return placesForGuide.filter((p) => selectedPlaces.includes(String(p._id)));
  }, [placesForGuide, selectedPlaces]);

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be a positive number';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate) {
      const start = new Date(form.startDate);
      const min = new Date();
      min.setDate(min.getDate() + 15);
      if (start < new Date(min.toDateString())) {
        e.startDate = 'Start date must be at least 15 days in the future';
      }
    }
    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end <= start) {
        e.endDate = 'End date must be after the start date';
      }
    }
    if (!form.startLocation) e.startLocation = 'Start location is required';
    if (!form.endLocation) e.endLocation = 'End location is required';
    if (!form.maxClients || Number(form.maxClients) <= 0) e.maxClients = 'Max clients must be a positive number';
    if (!selectedPlaces.length) e.guidesPlacesId = 'Select at least one place';
    if (!imageFile) e.profileImg = 'An image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onSelectPlace = (id) => {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    if (errors.guidesPlacesId) setErrors((prev) => ({ ...prev, guidesPlacesId: '' }));
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.profileImg) setErrors((prev) => ({ ...prev, profileImg: '' }));
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
    fd.append('guidesPlacesId', JSON.stringify(selectedPlaces));
    if (imageFile) fd.append('profileImg', imageFile);

    try {
      await dispatch(createPack(fd)).unwrap();
      toast.success('Pack créé avec succès');
      navigate('/guide/PacksGuide');
    } catch (err) {
      toast.error(err?.message || 'Échec de la création du pack');
    }
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Add New Pack</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {imagePreview && (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
              {!imagePreview && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#EB662B] transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                  <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                </label>
              )}
            </div>
            {errors.profileImg && <p className="text-sm text-red-500 mt-1">{errors.profileImg}</p>}
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Guide Places
                {selectedPlaces.length > 0 && (
                  <span className="ml-2 text-[#EB662B] font-semibold">({selectedPlaces.length} sélectionnée{selectedPlaces.length > 1 ? 's' : ''})</span>
                )}
              </label>
            </div>

            {/* Places sélectionnées */}
            {selectedPlacesDetails.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Places sélectionnées</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPlacesDetails.map((place) => (
                    <div
                      key={place._id}
                      className="flex items-center gap-2 bg-white border border-green-300 rounded-lg px-3 py-2 group hover:border-green-500 transition-colors"
                    >
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {place.images?.[0] && (
                          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="text-sm flex-1">
                        <div className="font-medium text-gray-900">{place.name}</div>
                        <div className="text-gray-500 text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {place.city}, {place.country}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectPlace(String(place._id))}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        title="Retirer"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EB662B] focus:border-transparent outline-none transition-all"
                />
              </div>
              <select
                value={filterByCountry}
                onChange={(e) => setFilterByCountry(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#EB662B] focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="all">Tous les pays</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Liste des places disponibles */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredPlaces.length} place{filteredPlaces.length > 1 ? 's' : ''} disponible{filteredPlaces.length > 1 ? 's' : ''}
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-gray-500">
                    Page {currentPage} sur {totalPages}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white min-h-[200px]">
                {paginatedPlaces.length > 0 ? (
                  paginatedPlaces.map((p) => {
                    const isSelected = selectedPlaces.includes(String(p._id));
                    return (
                      <label
                        key={p._id}
                        className={`relative flex flex-col gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-[#EB662B] bg-orange-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelectPlace(String(p._id))}
                            className="h-4 w-4 text-[#EB662B] rounded focus:ring-[#EB662B] cursor-pointer flex-shrink-0"
                          />
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate" title={p.name}>
                            {p.name}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{p.city}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EB662B] rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </label>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune place trouvée</p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setFilterByCountry('all'); }}
                        className="mt-2 text-sm text-[#EB662B] hover:underline"
                      >
                        Réinitialiser les filtres
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#EB662B] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {errors.guidesPlacesId && <p className="text-sm text-red-500 mt-1">{errors.guidesPlacesId}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/guide/PacksGuide')} className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" disabled={packLoading}>
              Annuler
            </button>
            <button type="submit" disabled={packLoading} className="px-6 py-2 text-white cursor-pointer bg-[#EB662B] rounded-lg hover:bg-[#d55a26] transition-colors disabled:opacity-50 flex items-center gap-2">
              {packLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Création...</>) : 'Ajouter le Pack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
