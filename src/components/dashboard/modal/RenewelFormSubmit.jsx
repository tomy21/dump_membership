import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cryptoJs from 'crypto-js';

const RenewalFormSubmit = ({
  transactionData,
  virtualAccount,
  price,
  closeModal,
  handleSubmitFinal,
}) => {
  const [paymentFile, setpPaymentFile] = useState(null);

  const handleFileChange = (e) => {
    setpPaymentFile(e.target.files[0]);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const encryptData = (data) => {
    return cryptoJs.AES.encrypt(
      JSON.stringify(data),
      'galihtanjungtresna'
    ).toString();
  };
  console.log(transactionData);
  const handleSubmit = (e) => {
    e.preventDefault();

    // Buat objek biasa untuk mengenkripsi data
    const dataToEncrypt = {
      fullname: transactionData.fullname,
      phonenumber: transactionData.phonenumber,
      membershipStatus: 'extend',
      email: transactionData.email,
      vehicletype: transactionData.vehicletype,
      NoCard: transactionData.NoCard,
      PlateNumber: transactionData.PlateNumber,
      locationCode: transactionData.locationCode,
    };

    const encryptedPayload = encryptData(dataToEncrypt);
    const formPayload = new FormData();
    formPayload.append('encryptedPayload', encryptedPayload);

    if (paymentFile) {
      formPayload.append('paymentFile', paymentFile);
    }

    handleSubmitFinal(formPayload); // Mengirimkan formData yang sudah diisi dan dienkripsi
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 px-3"
      style={{ margin: 0 }}
    >
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>
        <div className="border-b border-slate-400 my-2"></div>

        <form onSubmit={handleSubmit}>
          <p>
            <strong>No Kartu:</strong> {transactionData.NoCard}
          </p>
          <p>
            <strong>Nomor Plat:</strong> {transactionData.PlateNumber}
          </p>
          <p>
            <strong>Tipe Kendaraan:</strong> {transactionData.vehicletype}
          </p>

          <p className="mt-3">Silahkan transfer ke no VA berikut</p>
          <p className="text-base font-semibold">{virtualAccount}</p>
          <p>
            Nominal :{' '}
            <span className="text-base font-semibold">
              {formatCurrency(price)}
            </span>
          </p>

          <label className="block text-gray-700 mt-4">
            Upload Bukti Transfer:
          </label>
          <input
            type="file"
            name="paymentFile"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
            accept=".jpg, .png, .jpeg"
            required
          />

          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Define PropTypes
RenewalFormSubmit.propTypes = {
  transactionData: PropTypes.shape({
    NoCard: PropTypes.string.isRequired,
    PlateNumber: PropTypes.string.isRequired,
    vehicletype: PropTypes.string.isRequired,
    locationCode: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    phonenumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  virtualAccount: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmitFinal: PropTypes.func.isRequired,
};

export default RenewalFormSubmit;
