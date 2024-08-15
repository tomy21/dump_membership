import React from "react";
import MemberTable from "./MemberTable";

const DashboardContent = () => {
  const memberStats = [
    { title: "Member Baru", count: 120 },
    { title: "Perpanjang", count: 120 },
    { title: "Sudah Diambil", count: 85 },
    { title: "Menunggu Diambil", count: 20 },
    { title: "Sedang Diproses", count: 15 },
    { title: "Total Member", count: 240 },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {memberStats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white shadow-md rounded-lg flex flex-col items-start justify-start px-3 py-4 border-l-4 border-emerald-500"
          >
            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
            <h3 className="text-sm font-medium  text-gray-500">{stat.title}</h3>
          </div>
        ))}
      </div>
      <MemberTable />
    </div>
  );
};

export default DashboardContent;
