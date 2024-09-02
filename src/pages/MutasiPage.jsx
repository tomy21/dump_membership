import React from 'react';
import MutasiTable from '../components/dashboard/MutasiTable';

export default function MutasiPage() {
  return (
    <>
      <div className="max-h-screen bg-gray-100 overflow-hidden">
        <div className="max-h-[90vh] overflow-auto">
          <MutasiTable />
        </div>
      </div>
    </>
  );
}
