import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  

  return (
    <div className="w-60 h-screen bg-gray-100 p-6 shadow-lg flex flex-col gap-4 text-lg font-medium">
      <Link
        to="/allproduct"
        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition"
      >
        🛒 All Products
      </Link>
      <Link
        to="/createproduct"
        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition"
      >
        ➕ Create Product
      </Link>
    </div>
  );
};
export default Sidebar;
