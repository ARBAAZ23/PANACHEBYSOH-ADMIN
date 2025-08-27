import React, { useState } from "react";
import { assets } from "../assets/assets";
import { backendUrl } from "../assets/config";

const Add = () => {
  const [images, setImages] = useState(Array(5).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(5).fill(null));

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...images];
      newFiles[index] = file;
      setImages(newFiles);

      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);
    }
  };

  const handleSizeChange = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token"); // or however you store it

  const formData = new FormData();
  formData.append("name", productName);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("sizes", JSON.stringify(sizes));
  formData.append("bestseller", bestseller);

  images.forEach((file, i) => {
    if (file) {
      formData.append(`image${i + 1}`, file);
    }
  });

  try {
    const res = await fetch(backendUrl + "api/product/add", {
      method: "POST",
      headers: {
        token: token, // required for authentication
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Server response:", data);

    if (res.ok) {
      alert("Product added successfully!");
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Failed to add product.");
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-3xl mx-auto">
      {/* Upload Images */}
      <div>
        <p className="font-semibold mb-2">Upload Images</p>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {[...Array(5)].map((_, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={imagePreviews[index] || assets.upload_area}
                alt={`Upload ${index + 1}`}
                className="w-25 h-25 sm:w-24 sm:h-24 object-cover border rounded shadow-md"
              />
              <input
                type="file"
                id={`image${index + 1}`}
                hidden
                onChange={(e) => handleImageChange(e, index)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <p className="font-semibold">Product Name</p>
        <input
          type="text"
          placeholder="Type here"
          required
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Description */}
      <div>
        <p className="font-semibold">Product Description</p>
        <textarea
          placeholder="Enter description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full"
        ></textarea>
      </div>

      {/* Price */}
      <div>
        <p className="font-semibold">Product Price</p>
        <input
          type="number"
          placeholder="Enter price"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Category */}
      <div>
        <p className="font-semibold">Product Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          <option value="kaftans">Kaftans</option>
          <option value="gowns">Gowns</option>
          <option value="suits">Suits</option>
          <option value="luxury pret">Luxury Pret</option>
          <option value="drapes">Drapes</option>
          <option value="bridal">Bridal</option>
          <option value="semi bridal">Semi Bridal</option>
          <option value="lehengas">Lehengas</option>
        </select>
      </div>

      {/* Sizes */}
      <div>
        <p className="font-semibold">Product Sizes</p>
        <div className="flex flex-wrap gap-4">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div>
        <label className="flex items-center font-semibold gap-2">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
          />
          Product Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;
