import React from 'react';
import DashboardContent from '../components/dashboard/DashboardContent';

const AdminPage = () => {
  return (
    <div className="max-h-screen bg-gray-100 overflow-hidden">
      <div className="max-h-[90vh] overflow-auto">
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminPage;
