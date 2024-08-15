import React, { useState, useEffect } from "react";
import { MdMoreVert, MdOutlineFileDownload } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const MemberTable = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Baru",
      date: "2024-08-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Perpanjang",
      date: "2024-08-02",
    },
    {
      id: 3,
      name: "Robert Brown",
      status: "Awaiting Pickup",
      date: "2024-08-03",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Process",
    },
    {
      id: 4,
      name: "Robert Brown",
      date: "2024-08-03",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Menunggu diambil",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Sudah diambil",
      date: "2024-08-03",
    },
    {
      id: 6,
      name: "Robert Brown",
      email: "johndoe@test.com",
      nokartu: "0981233",
      noTlp: "08123123",
      status: "Baru",
      date: "2024-08-03",
    },
    // Tambahkan data member lainnya di sini
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = () => {
    const csvData = filteredData.map((row) =>
      [row.id, row.name, row.status, row.date].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Status,Date", ...csvData].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "member_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Member Data</h3>

      {/* Search and Export */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search..."
          className="p-2 border rounded-md w-60"
        />
        <button
          onClick={handleExport}
          className="px-3 py-2 rounded-lg text-indigo-500 text-sm flex flex-row justify-center items-center space-x-2 border border-slate-200 shadow-inner hover:bg-green-100"
        >
          <MdOutlineFileDownload />
          <p>Export</p>
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              ID
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Tanggal Input
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Nama
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              No Telphone
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              No Kartu
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="py-2 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((member) => (
            <tr key={member.id}>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.id}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.date}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.name}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.email}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.noTlp}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.nokartu}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                {member.status}
              </td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">
                <MdMoreVert />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-700">
            Page{" "}
            <strong>
              {currentPage} of {totalPages}
            </strong>{" "}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-gray-200"
          >
            <FaArrowLeftLong />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            if (totalPages > 10 && (i + 1 === 2 || i + 1 === totalPages - 1)) {
              return (
                <span key={i} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              );
            }
            if (totalPages > 10 && i + 1 > 2 && i + 1 < totalPages - 1) {
              return null;
            }
            return (
              <button
                key={i}
                onClick={() => handlePageClick(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  i + 1 === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={() =>
              handlePageClick(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md bg-gray-200"
          >
            <FaArrowRightLong />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border p-2 rounded-md"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Rows */}
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          Total Rows: <span className="font-bold">{filteredData.length}</span>
        </p>
      </div>
    </div>
  );
};

export default MemberTable;
