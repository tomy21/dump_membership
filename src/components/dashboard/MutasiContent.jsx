import React from 'react';
import MutasiTable from './MutasiTable';

export default function MutasiContent() {
  const memberStats = [
    { title: 'Member Baru', count: 10 },
    { title: 'Perpanjang', count: 10 },
    { title: 'Sudah Diambil', count: 10 },
    { title: 'Menunggu Diambil', count: 10 },
    { title: 'Sedang Diproses', count: 10 },
    { title: 'Total Member', count: 10 },
  ];
  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {memberStats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white shadow-md rounded-lg flex flex-col items-start justify-start px-3 py-4 border-l-4 border-emerald-500"
            >
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
              <h3 className="text-sm font-medium  text-gray-500">
                {stat.title}
              </h3>
            </div>
          ))}
        </div>
        <MutasiTable />
      </div>
    </>
  );
}
