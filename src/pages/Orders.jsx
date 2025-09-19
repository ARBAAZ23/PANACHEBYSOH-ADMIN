import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import OrderItems from "./OrderItems"; // component to show items

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Available statuses for admin
  const statuses = ["Placed", "Packing", "Dispatched", "Delivering", "Delivered"];

  // ✅ Fetch all orders
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

  // ✅ Update order status by admin
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}api/order/status`, // ✅ FIXED route
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders(); // refresh after update
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Something went wrong while updating order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        No orders found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Orders</h2>

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

              {/* Admin dropdown to change status */}
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                {statuses.map((status, i) => (
                  <option key={i} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
                <span className="font-medium">Total:</span> £{order.amount}
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
