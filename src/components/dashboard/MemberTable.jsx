import React, { useState, useEffect } from 'react';
import DetailTransaction from './modal/DetailTransaction';
import { MdMoreVert, MdOutlineFileDownload } from 'react-icons/md';
import { FaArrowLeftLong, FaArrowRightLong, FaSpinner } from 'react-icons/fa6';

import { GoAlert } from 'react-icons/go';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getTransaction } from '../../api/apimembers';
import Tabs from '../Tabs';

const MemberTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectTransactionId, setSelectedTransactionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [userName, setUserName] = useState('-');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, rowsPerPage, activeTab]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = Cookies.get('refreshToken');
      if (!token) {
        navigate('/');
      } else {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.sub);
      }
    };
    fetchToken();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const status = activeTab === 'all' ? '' : activeTab;

      if (activeTab === 'all') {
        const response = await getTransaction.getData(
          searchTerm,
          currentPage,
          rowsPerPage
        );
        console.log('data', response);
        setData(response.data.transactions);
        setTotalPages(response.data.totalPages);
        setTotalRows(response.data.totalCount);
        setCurrentPage(response.data.currentPage);
        setRowsPerPage(response.data.rowsPerPage || rowsPerPage);
      } else {
        const response = await getTransaction.getByStatus(
          status,
          searchTerm,
          currentPage,
          rowsPerPage
        );
        console.log('data', response);
        setData(response.data.transactions);
        setTotalPages(response.data.totalPages);
        setTotalRows(response.data.totalCount);
        setCurrentPage(response.data.currentPage);
        setRowsPerPage(response.data.rowsPerPage || rowsPerPage);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = async () => {
    try {
      const response = await getTransaction.exportData();
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dumpDataMembers.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleShowDetail = (id) => {
    setSelectedTransactionId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDropdownIndex(null);
    setSelectedTransactionId(null);
    fetchData();
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const handleEdit = async (id) => {
    setIsLoading(true);

    const member = data.find((item) => item.id === id);

    if (!member.NoCard) {
      setShowErrorPopup(true);
      setIsLoading(false);
      setDropdownIndex(null);
      return;
    }

    setTimeout(async () => {
      const response = await getTransaction.sendMessage(id, userName);
      console.log(response);

      setIsLoading(false);
      setDropdownIndex(null);
      fetchData();
    }, 1000);
  };

  const handleDone = async (id) => {
    setIsLoading(true);

    setTimeout(async () => {
      const response = await getTransaction.updateDone(id, userName);
      console.log(response);

      setIsLoading(false);
      setDropdownIndex(null);
      fetchData();
    }, 1000);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'new':
        return 'text-blue-500';
      case 'progress':
        return 'text-yellow-500';
      case 'take':
        return 'text-purple-500';
      case 'done':
        return 'text-green-500';
      case true:
        return 'text-green-500';
      case false:
        return 'text-red-500';
      case 'extend':
        return 'text-gray-500';
      case 'ismember':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
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
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                onChange={handleSelectAllChange}
                checked={
                  selectedItems.length === data.length && data.length > 0
                }
              />
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              No Antrian
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Nama
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Kontak
            </th>

            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              No Kartu
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Keterangan
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
              Pembayaran
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700 w-36">
              Status
            </th>
            <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((member, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(member.id)}
                    onChange={() => handleCheckboxChange(member.id)}
                  />
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {member.NoRef}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {member.fullname}
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="text-sm font-normal">{member.email}</h1>
                    <h1 className="text-sm font-normal text-slate-300">
                      {member.phonenumber}
                    </h1>
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
                  {member.NoCard}
                </td>
                <td className="border-b text-gray-700 text-xs">
                  <div
                    className={`flex flex-row justify-start items-center gap-x-2 px-2 py-1 rounded-md ${getStatusStyles(
                      member.membershipStatus
                    )}`}
                  >
                    <div
                      className={`relative w-4 h-4 rounded-full flex justify-center items-center ${getStatusStyles(
                        member.membershipStatus
                      )}`}
                    >
                      <div className="absolute w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    <h1 className="text-xs">
                      {member.membershipStatus.toUpperCase()}
                    </h1>
                  </div>
                </td>
                <td className="border-b text-gray-700 text-xs">
                  <div
                    className={`flex flex-row justify-start items-center gap-x-2 px-2 py-1 rounded-md ${getStatusStyles(
                      member.isBayar
                    )}`}
                  >
                    <div
                      className={`relative w-4 h-4 rounded-full flex justify-center items-center ${getStatusStyles(
                        member.isBayar
                      )}`}
                    >
                      <div className="absolute w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    <h1 className="text-xs">
                      {member.isBayar === false
                        ? 'Pending'.toUpperCase()
                        : 'Bayar'.toUpperCase()}
                    </h1>
                  </div>
                </td>
                <td className="border-b text-gray-700 text-xs">
                  <div
                    className={`flex flex-row justify-start items-center gap-x-2 px-2 py-1 rounded-md ${getStatusStyles(
                      member.statusProgress
                    )}`}
                  >
                    <div
                      className={`relative w-4 h-4 rounded-full flex justify-center items-center ${getStatusStyles(
                        member.statusProgress
                      )}`}
                    >
                      <div className="absolute w-2 h-2 rounded-full bg-current"></div>
                    </div>
                    <h1 className="text-xs">
                      {member.statusProgress.toUpperCase()}
                    </h1>
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-sm text-gray-700 relative">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setDropdownIndex(dropdownIndex === index ? null : index)
                    }
                  >
                    <MdMoreVert />
                  </div>
                  {dropdownIndex === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => handleShowDetail(member.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                      >
                        Detail
                      </button>

                      {member.statusProgress === 'take' ? (
                        <>
                          {isLoading ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <button
                              onClick={() => handleDone(member.id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                            >
                              Sudah Diambil
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {isLoading ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <button
                              onClick={() => handleEdit(member.id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                            >
                              Siap Diambil
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                Data Not Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm text-gray-700">
            Page{' '}
            <strong>
              {currentPage} of {totalPages}
            </strong>{' '}
          </span>
        </div>

        <div className="flex flex-row justify-center items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Per page:</span>
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md bg-gray-200"
            >
              <FaArrowLeftLong />
            </button>
            <div className="flex flex-row justify-end items-center gap-x-3">
              {Array.from({ length: totalPages }).map((_, i) => {
                if (
                  totalPages > 10 &&
                  (i + 1 === 2 || i + 1 === totalPages - 1)
                ) {
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
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
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
          </div>
        </div>
      </div>

      {/* Total Rows */}
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          Total Rows: <span className="font-bold">{totalRows}</span>
        </p>
      </div>

      {showModal && (
        <DetailTransaction
          idTransaksi={selectTransactionId}
          isClosed={closeModal}
        />
      )}

      {showErrorPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-3"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-4">
            <GoAlert size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold mb-4">
              {'No Kartu harus di isi'}
            </h2>
            <button
              onClick={closeErrorPopup}
              className="bg-red-500 text-white p-3 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;
