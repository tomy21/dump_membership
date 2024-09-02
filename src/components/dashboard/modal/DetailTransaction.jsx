import React, { useState, useEffect } from 'react';
import { getTransaction } from '../../../api/apimembers';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export default function DetailTransaction({ idTransaksi, isClosed }) {
  const [data, setData] = useState(null); // Mengubah dari string kosong menjadi null untuk data
  const [noCard, setNoCard] = useState(''); // Inisialisasi noCard sebagai string kosong
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditingNoCard, setIsEditingNoCard] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [searchError, setSearchError] = useState(null); // Untuk menangani error pencarian

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransaction.getById(idTransaksi);

        setData(response.data);
        setNoCard(response.data.NoCard || '');
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchData();
  }, [idTransaksi]);

  const handleNoCardChange = (e) => {
    setNoCard(e.target.value);
  };

  const handleNoCardUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('NoCard', noCard);

      await getTransaction.updateById(idTransaksi, formData);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsEditingNoCard(false);
      }, 1000);
    } catch (error) {
      console.error('Gagal memperbarui NoCard:', error);
    }
  };

  const handleUpdatePembayaran = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('statusProgress', 'progress');

      await getTransaction.updateById(idTransaksi, formData);
      await getTransaction.updatedPayment(idTransaksi);

      setIsSuccess(true);
      setIsUpdateSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsUpdateSuccess(false);
        setShowSearchModal(false);
        isClosed();
      }, 3000);
    } catch (error) {
      console.error('Gagal memperbarui status pembayaran:', error);
    } finally {
      setIsLoading(false); // Mengakhiri loading setelah proses selesai
    }
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'new':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSearch = async () => {
    setSearchError(null); // Reset error sebelum pencarian
    try {
      console.log(searchTerm);
      const response = await getTransaction.getMutasi(searchTerm);

      if (response.data.length > 0) {
        setSearchResults(response.data);
        setShowSearchModal(true);
      } else {
        setSearchError('Data Not Found'); // Jika data tidak ditemukan
      }
    } catch (error) {
      console.error('Error searching data:', error);
      setSearchError('Error searching data'); // Menampilkan error jika terjadi kesalahan pencarian
    }
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50 px-2">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 sm:w-[50%] relative">
          <button
            onClick={isClosed}
            className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          <div className="">
            <h2 className="text-lg font-semibold mb-4">Detail Transaksi</h2>
            {data ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-6">
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">Email</h1>
                    <h1 className="text-slate-400 text-sm">{data.email}</h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">User Name</h1>
                    <h1 className="text-slate-400 text-sm">{data.fullname}</h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">Nomo Telephone</h1>
                    <h1 className="text-slate-400 text-sm">
                      {data.phonenumber}
                    </h1>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">Plat Nomor</h1>
                    <h1 className="text-slate-400 text-sm">
                      {data.PlateNumber}
                    </h1>
                  </div>

                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">Status</h1>
                    <h1
                      className={`text-blue-500 hover:text-blue-700 bg-blue-100 py-1 px-2 rounded-md ${getStatusStyles(
                        data.statusProgress
                      )}`}
                    >
                      {data.statusProgress}
                    </h1>
                  </div>

                  <div className="flex flex-col justify-start items-start">
                    <h1 className="font-semibold text-sm">No Card</h1>
                    {isEditingNoCard ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={noCard}
                          onChange={handleNoCardChange}
                          className="text-slate-400 text-sm border p-1 rounded"
                        />
                        <button
                          onClick={handleNoCardUpdate}
                          className="text-blue-500 hover:text-blue-700 bg-blue-100 py-1 px-2 rounded-md"
                        >
                          Save
                        </button>
                        {isSuccess && (
                          <IoMdCheckmarkCircleOutline className="ml-2 text-green-500" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h1 className="text-slate-400 text-sm">
                          {noCard || 'No Card Available'}
                        </h1>
                        {!noCard && (
                          <button
                            onClick={() => setIsEditingNoCard(true)}
                            className="text-blue-500 hover:text-blue-700 bg-blue-100 py-1 px-2 rounded-md"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-b border-slate-300 my-3"></div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mb-6">
                  <div className="flex flex-col justify-start items-start p-2">
                    <h1 className="font-semibold text-sm mb-2">STNK</h1>
                    <img
                      src={
                        data.stnk
                          ? `https://devapi-injectmember.skyparking.online/uploads/stnk/${data.stnk}`
                          : '/public/no-image.png'
                      }
                      alt="STNK"
                      className="w-32 rounded-md shadow-md cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          `https://devapi-injectmember.skyparking.online/uploads/stnk/${data.stnk}`
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col justify-start items-start p-2">
                    <h1 className="font-semibold text-sm mb-2">Plat Nomor</h1>
                    <img
                      src={
                        data.licensePlate
                          ? `https://devapi-injectmember.skyparking.online/uploads/licensePlate/${data.licensePlate}`
                          : '/public/no-image.png'
                      }
                      alt="Plat Nomor"
                      className="w-32 rounded-md shadow-md cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          `https://devapi-injectmember.skyparking.online/uploads/licensePlate/${data.licensePlate}`
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col justify-start items-start p-2">
                    <h1 className="font-semibold text-sm mb-2">
                      Bukti Pembayaran
                    </h1>
                    <img
                      src={
                        data.paymentFile
                          ? `https://devapi-injectmember.skyparking.online/uploads/transfer/${data.paymentFile}`
                          : '/public/no-image.png'
                      }
                      alt="Bukti Pembayaran"
                      className="w-32 rounded-md shadow-md cursor-pointer"
                      onClick={() =>
                        handleImageClick(
                          `https://devapi-injectmember.skyparking.online/uploads/transfer/${data.paymentFile}`
                        )
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-slate-300 my-3"></div>

                {/* Search Section */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Mutasi"
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    onClick={handleSearch}
                    className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md"
                  >
                    Search
                  </button>
                </div>
                {searchError && (
                  <div className="mt-2 text-red-500">{searchError}</div>
                )}
              </div>
            ) : (
              <div>Loading data...</div>
            )}
          </div>
        </div>
      </div>

      {/* Search Result Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-xl relative">
            <button
              onClick={closeSearchModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} className="border-b py-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-start items-start">
                      <h1 className="text-sm">{result.description}</h1>
                      <h1 className="text-sm">
                        {format(new Date(result.dateinsert), 'dd MMMM yyyy')}
                      </h1>
                    </div>
                    <button
                      onClick={() => {
                        handleUpdatePembayaran();
                      }}
                      className="text-green-500 hover:text-green-700 bg-green-100 px-3 py-2 text-xs"
                    >
                      Update Paid
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full Size"
              className="max-w-full max-h-full rounded-lg shadow-lg w-[80%] h-[70%]"
            />
            <button
              className="absolute top-2 right-2 text-white text-3xl"
              onClick={closeImageModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
            <h2 className="text-lg font-semibold">Sedang Memperbarui...</h2>
          </div>
        </div>
      )}

      {/* Modal untuk Update Sukses */}
      {isUpdateSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-center items-center">
            <IoMdCheckmarkCircleOutline className="text-green-500 text-7xl mb-4" />
            <h2 className="text-lg font-semibold">
              Pembayaran Berhasil Diperbarui
            </h2>
          </div>
        </div>
      )}
    </>
  );
}

DetailTransaction.propTypes = {
  idTransaksi: PropTypes.string.isRequired, // Misalnya, idTransaksi adalah string yang wajib diisi
  isClosed: PropTypes.func.isRequired, // Misalnya, isClosed adalah fungsi yang wajib diisi
};
