import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 px-5 py-3 rounded-md transition-all duration-300 ease-in-out
    ${isActive
      ? 'bg-gray-100 text-black font-semibold border-l-4 border-gray-800'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
    }`;

  return (
    <div className="h-screen w-16 md:w-56 bg-white border-r border-gray-200 flex flex-col justify-between animate-slideIn">

      {/* Menu items */}
      <div>
        <nav className="flex flex-col mt-6 text-sm font-medium">

          {/* Add Items */}
          <NavLink to="/add" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.add_icon} alt="Add" />
            <span className='hidden md:inline'>Add Items</span>
          </NavLink>

          {/* List Items */}
          <NavLink to="/list" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.list_icon} alt="List" />
            <span className='hidden md:inline'>List Items</span>
          </NavLink>

          {/* Orders */}
          <NavLink to="/orders" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.order_icon} alt="Orders" />
            <span className='hidden md:inline'>Orders</span>
          </NavLink>

          {/* All Users */}
          <NavLink to="/Users" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.user_icon} alt="Orders" />
            <span className='hidden md:inline'>All Users</span>
          </NavLink>

          {/* Analysis */}
          <NavLink to="/Analysis" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.analysis_icon} alt="Orders" />
            <span className='hidden md:inline'>Analysis</span>
          </NavLink>

          {/* Video*/}
          <NavLink to="/hero" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.upload} alt="UploadHome" />
            <span className='hidden md:inline'>UploadHome</span>
          </NavLink>

          {/* Image*/}
          <NavLink to="/about" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.about} alt="UploadAbout" />
            <span className='hidden md:inline'>UploadAbout</span>
          </NavLink>

          {/*Invoice */}
          <NavLink to="/invoice" className={linkClasses}>
            <img className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" src={assets.invoice} alt="UploadAbout" />
            <span className='hidden md:inline'>All Invoices</span>
          </NavLink>

        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
