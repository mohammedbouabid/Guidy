import React from "react";
import { Edit, Trash2 } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Apple Watch Series 4",
    category: "Digital Product",
    price: "$690.00",
    piece: 63,
    colors: ["#000000", "#f1f1f1", "#fca5a5"],
    image: "https://m.media-amazon.com/images/I/71fp5ankbqL._AC_SX679_.jpg",
  },
  {
    id: 2,
    name: "Microsoft Headsquare",
    category: "Digital Product",
    price: "$190.00",
    piece: 13,
    colors: ["#000000", "#fca5a5", "#60a5fa", "#facc15"],
    image: "https://m.media-amazon.com/images/I/71fp5ankbqL._AC_SX679_.jpg",
  },
  {
    id: 3,
    name: "Women's Dress",
    category: "Fashion",
    price: "$640.00",
    piece: 635,
    colors: ["#bae6fd", "#93c5fd", "#1e3a8a", "#312e81"],
    image: "https://m.media-amazon.com/images/I/71fp5ankbqL._AC_SX679_.jpg",
  },
  {
    id: 4,
    name: "Samsung A50",
    category: "Mobile",
    price: "$400.00",
    piece: 67,
    colors: ["#000000", "#1e3a8a", "#be123c"],
    image: "https://m.media-amazon.com/images/I/71fp5ankbqL._AC_SX679_.jpg",
  },
  {
    id: 5,
    name: "Camera",
    category: "Electronic",
    price: "$420.00",
    piece: 52,
    colors: ["#000000", "#1e3a8a", "#be123c"],
    image: "https://m.media-amazon.com/images/I/71fp5ankbqL._AC_SX679_.jpg",
  },
];

const PacksGuid = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
             Product List</h2>
          <button className="bg-[#EB662B]  text-white px-4 py-2 rounded-md hover:bg-[#d55a25] transition cursor-pointer">
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Image</th>
                <th className="px-6 py-3 text-left font-semibold">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Piece</th>
                <th className="px-6 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#EB662B]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Product Name */}
                  <td className="px-6 py-4 font-medium">{product.name}</td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-[#EB662B] text-xs font-medium">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {product.price}
                  </td>

                  {/* Piece */}
                  <td className="px-6 py-4">{product.piece}</td>

                  {/* Action buttons */}
                  <td className="px-6 py-4 flex justify-center space-x-3">
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-orange-100 transition cursor-pointer">
                      <Edit size={18} className="text-green-600" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 transition cursor-pointer">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-gray-500 bg-gray-50 border-t text-center">
          Showing {products.length} products
        </div>
      </div>
    </div>
  );
};

export default PacksGuid;
