import React from 'react'
import { assets } from '../assets/assets.js'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between animate-navbarSlideIn'>
      {/* Logo */}
      <img 
        className='w-[max(8%,60px)] transition-transform duration-300 hover:scale-105' 
        src={assets.logo} 
        alt="Logo" 
      />

      {/* Logout Button */}
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 hover:bg-gray-700 hover:scale-105'>
        Logout
      </button>
    </div>
  )
}

export default Navbar
