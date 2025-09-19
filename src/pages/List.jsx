import React, { useEffect, useState } from "react";
import { backendUrl } from "../assets/config";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}api/product/list`);
      setList(response.data.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load product list");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this product?"
    );
    if (!isConfirmed) return;

    setDeletingId(id);
    try {
      const response = await axios.post(
        `${backendUrl}api/product/remove`,
        { id },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-5 text-lg font-medium">
        {error}
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">
        Product List
      </h2>

      {list.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                <img
                  src={
                    product.image?.[0]?.startsWith("http")
                      ? product.image[0]
                      : `${backendUrl}${product.image?.[0]}`
                  }
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {product.bestseller && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Bestseller
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
                  {product.description}
                </p>

                <p className="text-lg font-bold text-blue-600 mt-3">
                  £{product.price}
                </p>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{product.category}</span>
                  <span>{product.sizes?.join(", ") || "N/A"}</span>
                </div>

                {/* ✅ Stock Info */}
                <div className="mt-2 text-sm font-medium text-gray-700">
                  Stock:{" "}
                  <span
                    className={`${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                        ? "text-orange-500"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? product.stock : "Out of Stock"}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeProduct(product._id)}
                  disabled={deletingId === product._id}
                  className={`mt-4 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300 ${
                    deletingId === product._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {deletingId === product._id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No products found.</p>
      )}
    </div>
  );
};

export default List;
