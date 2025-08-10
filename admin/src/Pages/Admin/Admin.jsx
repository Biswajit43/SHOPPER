import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Createproduct from '../../Component/Createproduct/Createproduct';
import Allproduct from '../../Component/Allproduct/Allproduct';
import Sidebar from '../../Component/Sidebar/Sidebar';

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Routes>
          <Route path="/createproduct" element={<Createproduct />} />
          <Route path="/allproduct" element={<Allproduct />} />
        </Routes>
      </div>
    </div>
  );
};
export default Admin;
