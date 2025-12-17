import React from "react";
import AdminSidebar from "./utils/AdminSidebar";
import AdminNavbar from "./utils/AdminNavbar";
import AdminDashboardPage from "./pages/AdminDashboardpage";

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminNavbar />

        <div className="bgcolor  p-3">
          <AdminDashboardPage />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
