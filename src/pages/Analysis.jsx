import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const Analysis = ({ token }) => {
  const [salesData, setSalesData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      const url = `${backendUrl}api/analysis`;
      const res = await axios.get(url, { headers: { token } });

      if (res.data.success) {
        setSalesData(res.data.salesOverTime || []);
        setTotalOrders(res.data.totalOrders || 0);
        setTotalSales(res.data.totalSales || 0);
        setTopProducts(res.data.topProducts || []);
      } else {
        toast.error("Failed to fetch analysis data");
      }
    } catch (err) {
      console.error("❌ Analysis fetch error:", err);
      toast.error("Error loading analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse">
        Loading analysis...
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 md:p-10 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-800">📊 Sales Analysis</h2>
      <p className="text-gray-600">Overview of orders and sales performance</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-6">
          <p className="text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
        </div>
        <div className="bg-white shadow rounded-2xl p-6">
          <p className="text-gray-500">Total Sales</p>
          <h3 className="text-2xl font-bold text-green-600">£{totalSales}</h3>
        </div>
      </div>

      {/* Line Chart: Sales Over Time */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#22C55E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Top Products */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Products This Month</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Analysis;
