import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import OrderItems from "./OrderItems"; // ⬅️ new component

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        You don’t have any orders yet.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Order ID:</span> {order._id}
              </p>
              <p
                className={`text-sm font-medium mt-2 md:mt-0 ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.status}
              </p>
            </div>

            {/* Items */}
            <div className="mb-4 space-y-3">
              {order.items?.map((item, idx) => (
                <OrderItems key={idx} item={item} />
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Payment:</span>{" "}
                {order.paymentMethod}{" "}
                {order.payment ? (
                  <span className="text-green-600">(Paid)</span>
                ) : (
                  <span className="text-red-500">(Pending)</span>
                )}
              </p>
              <p className="mt-2 md:mt-0">
                <span className="font-medium">Total:</span> ${order.amount}
              </p>
              <p className="mt-2 md:mt-0">
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
