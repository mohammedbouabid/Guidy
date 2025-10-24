import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPacks, createPack, updatePack, deletePack } from '../store/slices/packSlice';
import { toast } from 'react-hot-toast';
import { getErrorMessage, getToastErrorMessage } from '../utils/errorUtils';

const PackTestComponent = () => {
  const dispatch = useDispatch();
  const { items: packs, loading, error } = useSelector((state) => state.pack);

  const testCreatePack = async () => {
    const formData = new FormData();
    formData.append('title', 'Test Pack');
    formData.append('description', 'This is a test pack description');
    formData.append('price', '100');
    formData.append('startDate', '2024-02-01');
    formData.append('endDate', '2024-02-05');
    formData.append('startLocation', 'Paris');
    formData.append('endLocation', 'London');
    formData.append('maxClients', '10');
    formData.append('availability', 'true');
    
    try {
      await dispatch(createPack(formData)).unwrap();
      toast.success('Test pack created successfully!');
    } catch (error) {
      toast.error('Failed to create test pack: ' + getToastErrorMessage(error));
    }
  };

  const testFetchPacks = () => {
    dispatch(fetchPacks());
    toast.info('Fetching packs...');
  };

  const testDeletePack = (packId) => {
    if (window.confirm('Delete this test pack?')) {
      dispatch(deletePack(packId));
      toast.info('Deleting pack...');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">Pack CRUD Test Component</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={testFetchPacks}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Packs'}
        </button>
        
        <button 
          onClick={testCreatePack}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          disabled={loading}
        >
          Create Test Pack
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {getErrorMessage(error)}
        </div>
      )}

      <div className="bg-white p-4 rounded">
        <h4 className="font-semibold mb-2">Current Packs ({packs?.length || 0}):</h4>
        {packs && packs.length > 0 ? (
          <div className="space-y-2">
            {packs.map((pack) => (
              <div key={pack._id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <strong>{pack.title}</strong> - ${pack.price}
                  <br />
                  <small>{pack.startLocation} → {pack.endLocation}</small>
                </div>
                <button
                  onClick={() => testDeletePack(pack._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No packs found</p>
        )}
      </div>
    </div>
  );
};

export default PackTestComponent;
