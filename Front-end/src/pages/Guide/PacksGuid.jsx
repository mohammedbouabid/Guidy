import React, { useEffect, useState } from "react";
import { Edit, Trash2, Loader2, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPacks, deletePack } from "../../store/slices/packSlice";
import { toast } from "react-hot-toast";
import { getErrorMessage, getToastErrorMessage } from "../../utils/errorUtils";

const PacksGuid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: packs, loading, error } = useSelector((state) => state.pack);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPacks, setFilteredPacks] = useState([]);

  useEffect(() => {
    dispatch(fetchPacks());
  }, [dispatch]);

  useEffect(() => {
    if (packs) {
      const filtered = packs.filter(pack =>
        pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.endLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPacks(filtered);
    }
  }, [packs, searchTerm]);

  const handleDelete = async (packId) => {
    if (window.confirm('Are you sure you want to delete this pack?')) {
      try {
        await dispatch(deletePack(packId)).unwrap();
        toast.success('Pack deleted successfully');
      } catch (error) {
        toast.error(getToastErrorMessage(error, 'Failed to delete pack'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#EB662B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {getErrorMessage(error)}</p>
      </div>
    );
  }
  return (
    <div className="  w-full bg-gradient-to-br    to-gray-50  p-4">
      <div className=" bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Pack List</h2>
            <button onClick={() => navigate('/guide/packs/add')} className="bg-[#EB662B] text-white px-4 py-2 rounded-md hover:bg-[#d55a25] transition cursor-pointer">
              + Add Pack
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search packs by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB662B] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Image</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Pack Name
                </th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Max Clients</th>
                <th className="px-6 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredPacks && filteredPacks.length > 0 ? (
                filteredPacks.map((pack) => (
                  <tr
                    key={pack._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    {/* Image */}   
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EB662B]">
                        <img
                          src={pack.profileImg || "https://via.placeholder.com/48"}
                          alt={pack.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Pack Name */}
                    <td className="px-6 py-4 font-medium">{pack.title}</td>

                    {/* Category - using start/end location */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-[#EB662B] text-xs font-medium">
                        {pack.startLocation} → {pack.endLocation}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-gray-800 font-semibold">
                      ${pack.price}
                    </td>

                    {/* Max Clients */}
                    <td className="px-6 py-4">{pack.maxClients}</td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 flex justify-center space-x-3">
                      <button 
                        onClick={() => navigate(`/guide/packs/edit/${pack._id}`)} 
                        className="p-2 rounded-lg bg-gray-100 hover:bg-orange-100 transition cursor-pointer"
                      >
                        <Edit size={18} className="text-green-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pack._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No packs match your search criteria.' : 'No packs found. Create your first pack!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-500 bg-gray-50 border-t text-center">
          Showing {filteredPacks ? filteredPacks.length : 0} of {packs ? packs.length : 0} packs
        </div>
      </div>
    </div>
  );
};

export default PacksGuid;
