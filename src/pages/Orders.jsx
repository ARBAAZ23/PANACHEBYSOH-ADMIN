// Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import OrderItems from "./OrderItems";
import enUS from "date-fns/locale/en-US";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import endOfDay from "date-fns/endOfDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const statuses = [
    "Order Placed",
    "Dispatched",
    "Shipping",
    "Out for Delivery",
    "Delivered",
  ];

  // Fetch all orders
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
        const fetched = response.data.orders;
        setOrders(fetched);

        // Convert to calendar events
        const evs = fetched.map((ord) => {
          const dateObj = new Date(ord.date);
          return {
            title: `#${ord._id.slice(-6)}`,
            allDay: true,
            start: dateObj,
            end: endOfDay(dateObj),
            orderId: ord._id,
          };
        });
        setEvents(evs);
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

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${backendUrl}api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
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

  const ordersOnSelectedDate = selectedDate
    ? orders.filter((ord) => {
        const od = new Date(ord.date);
        return (
          od.getFullYear() === selectedDate.getFullYear() &&
          od.getMonth() === selectedDate.getMonth() &&
          od.getDate() === selectedDate.getDate()
        );
      })
    : [];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Manage Orders</h2>

      {/* Calendar */}
      <div className="border rounded-xl overflow-hidden shadow bg-white">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={({ start }) => setSelectedDate(start)}
          onSelectEvent={(event) => setSelectedDate(event.start)}
          style={{ height: 500 }}
        />
      </div>

      {/* Orders on Selected Date */}
      {selectedDate && (
        <div>
          <h3 className="text-xl font-medium text-gray-700 mb-4">
            Orders on{" "}
            {selectedDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          {ordersOnSelectedDate.length === 0 ? (
            <p className="text-gray-500">No orders on this date.</p>
          ) : (
            <div className="space-y-6">
              {ordersOnSelectedDate.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <p className="text-gray-700 text-sm">
                      <span className="font-medium">Order ID:</span> {order._id}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="border rounded-lg px-3 py-1 text-sm"
                    >
                      {statuses.map((status, i) => (
                        <option key={i} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {order.userId?.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {order.userId?.email}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {order.address?.street}, {order.address?.city},{" "}
                      {order.address?.pincode}
                    </p>
                  </div>

                  <div className="mb-4 space-y-3">
                    {order.items?.map((item, idx2) => (
                      <OrderItems key={idx2} item={item} />
                    ))}
                  </div>

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
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
