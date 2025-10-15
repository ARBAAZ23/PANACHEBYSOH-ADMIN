import React, { useEffect, useState } from "react";
import { backendUrl } from "../assets/config";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // For edit modal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: "",
  });

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

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      sizes: product.sizes?.join(", ") || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitUpdate = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}api/product/update`,
        {
          id: editingProduct,
          ...formData,
          sizes: formData.sizes.split(",").map((s) => s.trim()),
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Product updated");
        setEditingProduct(null);
        await fetchList();
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating product");
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

                {/* Buttons */}
                <div className="mt-4 flex justify-between gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product._id)}
                    disabled={deletingId === product._id}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                      deletingId === product._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === product._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No products found.</p>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Edit Product</h3>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              rows={3}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="sizes"
              placeholder="Sizes (comma separated)"
              value={formData.sizes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitUpdate}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
