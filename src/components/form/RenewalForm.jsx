import React, { useState, useEffect } from 'react';
import { getTransaction } from '../../api/apimembers';
import RenewelFormSubmit from '../dashboard/modal/RenewelFormSubmit';
import { GoAlert, GoChecklist } from 'react-icons/go';
import Loading from '../Loading';

const RenewalForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    NoCard: '',
  });
  const [availableCards, setAvailableCards] = useState([]);
  const [transactionData, setTransactionData] = useState(null); // State untuk data transaksi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [virtualAccount, setVirtualAccount] = useState('');
  const [statusResponse, setStatusResponse] = useState(false);
  const [message, setMessage] = useState('');
  const [showModalSubmit, setShowModalSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [statusKartu, setStatusKartu] = useState(null);

  useEffect(() => {
    if (formData.email) {
      fetchCardDetails();
    }
  }, [formData.email]);

  const fetchCardDetails = async () => {
    try {
      const response = await getTransaction.findTransactionData(formData.email);
      const data = response.data;

      if (data.length === 0) {
        setStatusKartu(false); // No cards found, set status to false
        setTransactionData(null); // Reset transaction data
      } else {
        setAvailableCards(data); // Store the found cards
        setStatusKartu(true); // Cards found, set status to true
      }
    } catch (error) {
      console.error('Failed to fetch card details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedData = availableCards.find(
      (transaction) => transaction.NoCard === formData.NoCard
    );
    if (selectedData) {
      const locations = await getTransaction.getLocation(
        1,
        10,
        selectedData.locationCode
      );
      if (selectedData.vehicletype === 'MOBIL') {
        setPrice(locations.data.items[0].prices[0].priceMobil);
        setVirtualAccount(locations.data.items[0].virtualAccount);
      } else {
        setPrice(locations.data.items[0].prices[0].priceMotor);
        setVirtualAccount(locations.data.items[0].virtualAccount);
      }
      setTransactionData(selectedData);
      setIsModalOpen(true);
    } else {
      setTransactionData({}); // Set empty object if no data is found to trigger registration form
    }
  };

  const handleSubmitFinal = async (formData) => {
    setLoading(true);
    try {
      const response = await getTransaction.createData(formData);
      setStatusResponse(response.status);
      setMessage(response.message);
      setShowModalSubmit(true);
      setFormData({ email: '', NoCard: '' });
      setStatusKartu(null);
      setLoading(false);
      closeModal();
    } catch (error) {
      setError(error.message);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPrice(0);
  };

  const closeModalSubmit = () => {
    setShowModalSubmit(false);
    setTransactionData([]);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setError(null);
  };

  if (loading) {
    return <Loading />;
  }
  console.log(statusKartu);
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {statusKartu === false ? (
          <div className="flex flex-col justify-center items-center space-y-5">
            <img src={'/no-results.svg'} className="w-28" alt="" />
            <p className="text-center text-sm text-slate-500 w-72">
              Maaf email anda belum terdaftar, mohon lakukan pendaftaran
              terlebih dahulu
            </p>
          </div>
        ) : statusKartu === true ? (
          <>
            <label htmlFor="NoCard" className="block text-gray-700">
              Nomor Kartu:
            </label>
            <select
              name="NoCard"
              id="NoCard"
              value={formData.NoCard}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Pilih Nomor Kartu</option>
              {availableCards.map((transaction, index) => (
                <option key={index} value={transaction.NoCard}>
                  {transaction.NoCard}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </>
        ) : (
          <p>
            Silakan masukkan email Anda untuk memeriksa nomor kartu yang
            tersedia.
          </p>
        )}
      </form>

      {isModalOpen && transactionData && statusKartu && (
        <RenewelFormSubmit
          transactionData={transactionData}
          virtualAccount={virtualAccount}
          price={price}
          closeModal={closeModal}
          handleSubmitFinal={handleSubmitFinal}
        />
      )}

      {showModalSubmit && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-3"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-4">
            {statusResponse ? (
              <>
                <GoChecklist className="w-20 h-20 text-green-500" />
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-lg font-semibold">Terimakasih</h2>
                  <h2 className="text-lg font-semibold">
                    Pendaftaran kamu berhasil
                  </h2>
                </div>
                <p className="text-center">
                  Mohon ditunggu untuk informasi selanjutnya
                </p>
                <button
                  onClick={closeModalSubmit}
                  className="bg-green-300 w-full rounded-md py-3"
                >
                  OKE
                </button>
              </>
            ) : (
              <>
                <GoAlert className="w-20 text-red-500" />
                <h2 className="text-lg font-semibold mb-4">{message}</h2>

                <button onClick={closeModalSubmit}>OKE</button>
              </>
            )}
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-3"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-4">
            <GoAlert size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold mb-4 text-center">{error}</h2>
            <button
              onClick={closeErrorPopup}
              className="bg-red-500 text-white p-3 rounded-lg px-10"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RenewalForm;
