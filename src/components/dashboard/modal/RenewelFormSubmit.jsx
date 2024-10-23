import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cryptoJs from 'crypto-js';
import { Location } from '../../../api/apimembers';

const RenewalFormSubmit = ({
  transactionData,
  closeModal,
  handleSubmitFinal,
}) => {
  const [paymentFile, setpPaymentFile] = useState(null);
  const [listLocation, setListLocation] = useState([]);
  const [virtualAccount, setVirtualAccount] = useState('');
  const [priceMember, setPriceMember] = useState(0);
  const [locationName, setLocationName] = useState('');
  const [rekNo, setRekNo] = useState('');
  const [rekName, setRekName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    {
      fetchLocation();
    }
  }, []);

  const handleFileChange = (e) => {
    setpPaymentFile(e.target.files[0]);
  };

  const fetchLocation = async () => {
    try {
      const response = await Location.getLocationCustomer(
        1,
        10,
        transactionData.locationCode
      );
      setVirtualAccount(response.data.items[0].virtualAccount);
      setListLocation(response.data.items[0].prices);
      setLocationName(response.data.items[0].initialLocation);
    } catch (error) {
      console.log(error);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const encryptData = (data) => {
    return cryptoJs.AES.encrypt(
      JSON.stringify(data),
      'galihtanjungtresna'
    ).toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Buat objek biasa untuk mengenkripsi data
    const dataToEncrypt = {
      fullname: transactionData.fullname,
      phonenumber: transactionData.phonenumber,
      email: transactionData.email,
      namaProduk: selectedProduct,
      NoCard: transactionData.NoCard,
      membershipStatus: 'extend',
      vehicletype: transactionData.vehicletype,
      locationCode: transactionData.locationCode,
      PlateNumber: transactionData.PlateNumber,
      noRek: rekNo,
      namaRek: rekName,
    };

    const encryptedPayload = encryptData(dataToEncrypt);
    const formPayload = new FormData();
    formPayload.append('encryptedPayload', encryptedPayload);

    console.log(formPayload);
    if (paymentFile) {
      formPayload.append('paymentFile', paymentFile);
    }

    handleSubmitFinal(formPayload);
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
          <table className="w-full">
            <tbody>
              <tr>
                <td>
                  <strong>No Kartu</strong>
                </td>
                <td>{transactionData.NoCard}</td>
              </tr>
              <tr>
                <td>
                  <strong>Nomor Plat</strong>
                </td>
                <td>{transactionData.PlateNumber}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tipe Kendaraan</strong>
                </td>
                <td>{transactionData.vehicletype}</td>
              </tr>
              <tr>
                <td>
                  <strong>Location</strong>
                </td>
                <td>{locationName}</td>
              </tr>
            </tbody>
          </table>

          <select
            name="locationPrice"
            id="locationPrice"
            onChange={(e) => {
              const selectedOption = JSON.parse(e.target.value);
              setPriceMember(selectedOption.price);
              setSelectedProduct(selectedOption.namaProduk);
              console.log(selectedOption); // Simpan nama produk yang terpilih
            }}
            className="w-full border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 mt-3 mb-1"
          >
            <option value="">Pilih produk</option>
            {listLocation.map((location) => (
              <option
                key={location.id}
                value={JSON.stringify({
                  // Ubah value menjadi string JSON
                  price:
                    transactionData.vehicletype === 'MOBIL'
                      ? location.priceMobil
                      : location.priceMotor,
                  namaProduk: location.namaProduk,
                })}
              >
                {location.namaProduk}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="namaRek"
            placeholder="Rekening atas nama"
            value={rekName}
            onChange={(e) => setRekName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 mb-1"
            required
          />
          <input
            type="number"
            name="noRek"
            placeholder="Nomor rekening"
            value={rekNo}
            onChange={(e) => setRekNo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 mb-1"
            required
          />

          <p className="mt-3">Silahkan transfer ke no VA berikut</p>
          <p className="text-base font-semibold">
            an.UPHC (Membership UPH Collage)
          </p>
          <p className="text-base font-semibold">{virtualAccount}</p>
          <p>
            Nominal :{' '}
            <span className="text-base font-semibold">
              {formatCurrency(parseInt(priceMember))}
            </span>
          </p>

          <label htmlFor="paymentFile" className="block text-gray-700 mt-4">
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
  price: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmitFinal: PropTypes.func.isRequired,
};

export default RenewalFormSubmit;
