import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../assets/config";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const User = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const url = `${backendUrl}api/user/list`;

      const response = await axios.get(url, {
        headers: { token },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Something went wrong while loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 animate-pulse">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">No users found.</div>
    );
  }

  return (
    <motion.div
  className="" // removed p-4 md:p-8
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-center">
    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
      👥 User Management
    </h2>
    <span className="mt-2 md:mt-0 text-gray-600 text-lg">
      Total Users:{" "}
      <span className="font-bold text-indigo-600">{users.length}</span>
    </span>
  </div>

  {/* Table */}
  <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
    <table className="min-w-full text-sm md:text-base">
      <thead>
        <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-left">
          <th className="py-3 px-4 border-b font-semibold">#</th>
          <th className="py-3 px-4 border-b font-semibold">Name</th>
          <th className="py-3 px-4 border-b font-semibold">Email</th>
          <th className="py-3 px-4 border-b font-semibold hidden md:table-cell">
            Phone
          </th>
          <th className="py-3 px-4 border-b font-semibold hidden md:table-cell">
            Registered
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <motion.tr
            key={idx}
            className="text-gray-700 hover:bg-indigo-50 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <td className="py-3 px-4 border-b">{idx + 1}</td>
            <td className="py-3 px-4 border-b font-medium">{user.name}</td>
            <td className="py-3 px-4 border-b break-words max-w-[200px]">
              {user.email}
            </td>
            <td className="py-3 px-4 border-b hidden md:table-cell">
              {user.phone || "—"}
            </td>
            <td className="py-3 px-4 border-b hidden md:table-cell">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
</motion.div>

  );
};

export default User;
