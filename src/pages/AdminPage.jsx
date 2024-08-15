import React from "react";
import Header from "../components/dashboard/Header";
import DashboardContent from "../components/dashboard/DashboardContent";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-h-[80vh] overflow-auto">
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminPage;
