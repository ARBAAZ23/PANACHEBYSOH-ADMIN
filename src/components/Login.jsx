import React, { useState } from "react";
import { backendUrl } from "../assets/config";
import axios from 'axios'
import { toast } from "react-toastify";

const Login = ({setToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
        e.preventDefault();
        // console.log("Backend URL:", backendUrl);
        const response =await axios.post(backendUrl+'api/user/admin',{email,password})
       if(response.data.success){
            setToken(response.data.token)
       }else{
        toast.error(response.data.message)
       }
        
    } catch (error) {
      console.error(error);
     toast.error(error.message)

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fadeSlideUp">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-500 ease-in-out">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Panel
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          {/* Email */}
          <div>
            <p className="mb-1 text-gray-700 font-medium">Email Address</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <p className="mb-1 text-gray-700 font-medium">Password</p>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400 transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
