import { LogOut } from 'lucide-react';
import React, { lazy, useEffect, useState } from 'react'
const api = lazy(() => import('./Axios'));

const Admin = () => {
 const handleLogout = ()=>{

 }
 const logout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };
 
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage users, view reports, and configure settings.</p>
       <button className="btn secondary full" onClick={logout}>
              Logout
            </button>
    </div>
  )
}

export default Admin
