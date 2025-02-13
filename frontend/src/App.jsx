import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Start from "views/Hrms/start";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import AuthLayout from "layouts/auth";
import EditLeave from "views/user/tables/components/EditLeave";
import EditProfile from "views/admin/tables/components/EditProfile";
import EditLeaveDetail from 'views/admin/leavedetails/EditLeaveDetail'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="user/*" element={<UserLayout />} />
      <Route path="edit-leave/:id" element={<EditLeave />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="edit-leaves" element={<EditLeaveDetail />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
