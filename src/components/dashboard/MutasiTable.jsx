import React, { useEffect, useState } from 'react';
// import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { getTransaction } from '../../api/apimembers';
import { format } from 'date-fns';
import Loading from '../Loading';
import Pagination from '../Pagination';

export default function MutasiTable() {
  const [dataMutasi, setDataMutasi] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [searchData, setSearchData] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchData, currentPage, limit, totalPage]);

  const fetchData = async () => {
    const response = await getTransaction.getMutasi(
      currentPage,
      limit,
      searchData
    );
    setDataMutasi(response.data);
    setTotalPage(response.totalPages);
    setLimit(response.totalFiltered);
  };

  const currencyFormat = (amount) => {
    return parseInt(amount).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  };
  // const handlePageClick = (page) => {
  //   if (page >= 1 && page <= totalPage) {
  //     setPages(page);
  //   }
  // };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);

    try {
      await getTransaction.uploadFile(formData);
      setIsSuccess(true);
      setShowUploadModal(false);
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Search and Export */}
        <div className="flex justify-between items-center mb-4">
          <input
            value={searchData}
            onChange={handleSearch}
            placeholder="Search..."
            className="p-2 border rounded-md w-60"
          />
          <div className="flex flex-row justify-center items-center">
            {/* <button
              onClick={openUploadModal}
              className="px-3 py-2 rounded-lg text-indigo-500 text-sm flex flex-row justify-center items-center space-x-2 border border-slate-200 shadow-inner hover:bg-green-100"
            >
              <MdOutlineFileUpload />
              <p>Download</p>
            </button> */}
            <button
              onClick={openUploadModal}
              className="px-3 py-2 rounded-lg text-indigo-500 text-sm flex flex-row justify-center items-center space-x-2 border border-slate-200 shadow-inner hover:bg-green-100"
            >
              <MdOutlineFileUpload />
              <p>Upload Mutasi</p>
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                Tanggal Transfer
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            {dataMutasi.length > 0 ? (
              dataMutasi.map((member, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {format(new Date(member.dateinsert), 'dd MMMM Y')}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {member.description}
                  </td>

                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {currencyFormat(member.nominal)}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={setCurrentPage}
        />

        {/* Total Rows
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
      )} */}

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-3">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
              <button
                onClick={closeUploadModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Upload Mutasi</h2>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md mb-4"
              />
              <button
                onClick={handleUpload}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}
      </div>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-lg font-semibold">Upload Berhasil!</h2>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
