import React, { useEffect, useState } from 'react';
import MemberTable from './MemberTable';
import { getTransaction } from '../../api/apimembers';

const DashboardContent = () => {
  const [dataCount, setDataCount] = useState({
    newMembersCount: 0,
    countAllTransactions: 0,
    progressCount: 0,
    takeCount: 0,
    doneCount: 0,
    countExtendMember: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const responseMetric = await getTransaction.getMetric();
        console.log(responseMetric);
        setDataCount(responseMetric);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMetrics();
  }, []);

  if (!dataCount) {
    return <div>Loading...</div>;
  }

  const memberStats = [
    { title: 'Member Baru', count: dataCount.newMembersCount },
    { title: 'Perpanjang', count: dataCount.countExtendMember },
    { title: 'Sudah Diambil', count: dataCount.doneCount },
    { title: 'Menunggu Diambil', count: dataCount.takeCount },
    { title: 'Sedang Diproses', count: dataCount.progressCount },
    { title: 'Total Member', count: dataCount.countAllTransactions },
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
