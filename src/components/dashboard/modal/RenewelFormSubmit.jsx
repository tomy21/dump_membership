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
  const [dataLocation, setDataLocation] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [noVa, setnoVa] = useState('');

  const handleFileChange = (e) => {
    setpPaymentFile(e.target.files[0]);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      console.log(transactionData.locationCode);
      const response = await Location.locationAll(
        1,
        transactionData.locationCode,
        5
      );
      setDataLocation(response.data.items);
      setnoVa(response.data.items[0].virtualAccount);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
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

    const selected = dataLocation[0].prices.find(
      (price) => price.id === parseInt(selectedProduct)
    );

    if (!selected) {
      return;
    }

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
      namaProduk: selected.namaProduk,
    };

    const encryptedPayload = encryptData(dataToEncrypt);
    const formPayload = new FormData();
    formPayload.append('encryptedPayload', encryptedPayload);

    if (paymentFile) {
      formPayload.append('paymentFile', paymentFile);
    }

    handleSubmitFinal(formPayload); // Mengirimkan formData yang sudah diisi dan dienkripsi
  };

  const getPriceForSelectedProduct = () => {
    if (!dataLocation || !dataLocation[0] || !dataLocation[0]?.prices) {
      return '-';
    }

    const selected = dataLocation[0].prices.find(
      (price) => price.id === parseInt(selectedProduct)
    );

    if (!selected) return '-';
    return transactionData.vehicletype.toLowerCase() === 'mobil'
      ? parseInt(selected.priceMobil)
      : parseInt(selected.priceMotor);
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
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <td className="font-bold w-52">No Kartu</td>
                <td>:</td>
                <td>{transactionData.NoCard}</td>
              </tr>
              <tr>
                <td className="font-bold">Nomor Plat</td>
                <td>:</td>
                <td>{transactionData.PlateNumber}</td>
              </tr>
              <tr>
                <td className="font-bold">Tipe Kendaraan</td>
                <td>:</td>
                <td>{transactionData.vehicletype}</td>
              </tr>
            </tbody>
          </table>

          <div className="border-b border-dashed border-slate-400 w-full mt-3"></div>

          <select
            name="product"
            id="product"
            value={selectedProduct}
            onChange={handleProductChange}
            className="border border-slate-400 px-2 py-1 rounded-md mt-3 w-1/2"
          >
            <option value="">Pilih Product</option>
            {dataLocation[0]?.prices?.map((data, index) => (
              <option key={index} value={data.id}>
                {data.namaProduk}
              </option>
            ))}
          </select>

          <p className="mt-3">Silahkan transfer ke no VA berikut</p>
          <p className="text-base font-semibold">{noVa ?? '-'}</p>
          <p className="text-base font-semibold mb-5">
            an. UPHC (Membership UPH College)
          </p>
          <p>
            Nominal :{' '}
            <span className="text-base font-semibold">
              {formatCurrency(getPriceForSelectedProduct())}
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
          <p className="italic text-slate-400 text-xs mt-3">
            <strong>Catatan</strong>: Pastikan bukti transfer terlihat jelas dan
            terlihat untuk detailnya{' '}
          </p>

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
