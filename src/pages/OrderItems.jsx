import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";

const OrderItems = ({ item }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const sizeKey = Object.keys(item).find(
    (k) => !["id", "name", "image"].includes(k)
  );
  const quantity = item[sizeKey];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/product/${item.id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [item.id]);

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-red-500 text-sm">Product not found</p>;
  }

  return (
    <div className="flex items-center gap-3 border-b pb-3 last:border-none">
      <img
        src={product.image?.[0]}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div>
        <p className="text-gray-800 font-medium">{product.name}</p>
        <p className="text-sm text-gray-500">
          Qty: {quantity} {sizeKey && `(${sizeKey})`}
        </p>
        <p className="text-sm font-semibold text-gray-700">
          ${product.price * quantity}
        </p>
      </div>
    </div>
  );
};

export default OrderItems;
