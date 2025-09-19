import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#EF4444", "#F59E0B"];

const Analysis = ({ token }) => {
  const [salesData, setSalesData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    try {
      const url = `${backendUrl}api/analysis`;
      const res = await axios.get(url, { headers: { token } });

      if (res.data.success) {
        setSalesData(res.data.salesOverTime || []);
        setProfitLossData(res.data.profitLoss || []);
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
      className="p-4 md:p-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">📊 Sales Analysis</h2>

      {/* Row of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Over Time */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Sales Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profit vs Loss */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Profit vs Loss
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={profitLossData}
                dataKey="value"
                nameKey="type"
                outerRadius={120}
                fill="#4F46E5"
                label
              >
                {profitLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Top Selling Products
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Analysis;
