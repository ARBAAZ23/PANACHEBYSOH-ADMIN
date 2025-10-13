import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from "./pages/User";
import Analysis from "./pages/Analysis";
import HeroAdmin from "./pages/HeroAdmin";
import AboutAdmin from "./pages/AboutAdmin";
import Invoice from './pages/Invoices'

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <>
      <ToastContainer />
      {token === "" ? (
        // Pass setToken so Login can update it when login is successful
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full animate-fadeIn">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path='/users' element={<User token={token} />} />
                <Route path='/analysis' element={<Analysis token={token} />} />
                <Route path="/hero" element={<HeroAdmin token={token} />} />
                <Route path="/about" element={<AboutAdmin token={token} />} />
                <Route path="/invoice" element={<Invoice token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
