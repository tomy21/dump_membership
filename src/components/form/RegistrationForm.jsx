import React, { useEffect, useState } from 'react';
import { getTransaction, Location } from '../../api/apimembers';
import CryptoJS from 'crypto-js';
import { GoAlert, GoChecklist } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { CiLocationOn } from 'react-icons/ci';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    phonenumber: '+62',
    email: '',
    NoCard: '',
    membershipStatus: '',
    vehicletype: '',
    locationCode: '',
    noRek: '',
    namaRek: '',
    PlateNumber: '',
    namaProduk: '',
  });
  const [files, setFiles] = useState({
    licensePlate: null,
    stnk: null,
    paymentFile: null,
  });
  const [locations, setLocations] = useState([]);
  const [quota, setQuota] = useState(0);
  const [virtualAccount, setVirtualAccount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingPlate, setLoadingPlate] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusResponse, setStatusResponse] = useState(false);
  const [showModalSubmit, setShowModalSubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [platNumber, setPlatNumber] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [listLocation, setListLocation] = useState([]);
  const [priceMember, setPriceMember] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLocations();
    fetchLocation();
  }, [formData.locationCode]);

  const fetchLocation = async () => {
    try {
      const response = await Location.getLocationCustomer(
        1,
        10,
        formData.locationCode
      );
      console.log(response);
      setVirtualAccount(response.data.items[0].virtualAccount);
      setListLocation(response.data.items[0].prices);
      setLocationName(response.data.items[0].locationName);
    } catch (error) {
      console.log(error);
    }
  };

  const loadLocations = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await getTransaction.getLocation();
      setLocations(response.data.items);
      setHasMore(page < response.data.totalPages);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'locationCode') {
      const selectedLocation = locations.find(
        (location) =>
          location.locationCode ===
          (name === 'locationCode' ? value : formData.locationCode)
      );
      setLocationName(selectedLocation?.locationName);
      setQuota(selectedLocation);
      setVirtualAccount(selectedLocation?.virtualAccount);
    }

    // if (name === 'vehicletype') {
    //   const selectedLocation = locations.find(
    //     (location) => location.locationCode === formData.locationCode
    //   );

    //   if (value === 'MOBIL') {
    //     setPrice(selectedLocation?.prices[0]?.priceMobil || 'N/A');
    //   } else if (value === 'MOTOR') {
    //     setPrice(selectedLocation?.prices[0]?.priceMotor || 'N/A');
    //   }
    // }
  };

  const currencyFormat = (amount) => {
    return parseInt(amount).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [name]: files[0],
      }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    let phoneNumber = e.target.value;
    phoneNumber = phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length > 20) {
      phoneNumber = phoneNumber.slice(0, 20);
    }

    if (phoneNumber.startsWith('62')) {
      setFormData({
        ...formData,
        phonenumber: '+' + phoneNumber,
      });
    } else {
      setFormData({
        ...formData,
        phonenumber: '+62' + phoneNumber.replace(/^0+/, ''),
      });
    }
  };

  const handlePlatUpload = (e) => {
    setFiles({
      ...files,
      licensePlate: e.target.files[0],
    });
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (files.licensePlate) {
      const fetchDataPlate = async () => {
        setLoadingPlate(true);
        const formUpload = new FormData();
        formUpload.append('upload', files.licensePlate);
        const apiToken = 'c6f266f5f06d9bbbb9b1688722211a9f2e7770d0';
        try {
          const response = await fetch(
            'https://api.platerecognizer.com/v1/plate-reader/',
            {
              method: 'POST',
              headers: {
                Authorization: `Token ${apiToken}`,
              },
              body: formUpload,
            }
          );

          const result = await response.json();
          if (result.results && result.results.length > 0) {
            setPlatNumber(result.results[0].plate.toUpperCase());
            setFormData({
              ...formData,
              PlateNumber: result.results[0].plate.toUpperCase(),
            });
            setEditEnabled(true);
          } else {
            console.log('Plate number not detected');
            setEditEnabled(true);
          }
        } catch (error) {
          console.error('Error:', error);
          setEditEnabled(true);
        } finally {
          setLoadingPlate(false);
        }
      };
      fetchDataPlate();
    }
  }, [files.licensePlate]);

  const handleEdit = () => {
    setShowEdit(true);
  };

  const closePopup = () => {
    setShowEdit(false);
  };

  const handleChange = (e) => {
    if (editEnabled) {
      const formattedValue = e.target.value.replace(/\s+/g, '').toUpperCase();
      setPlatNumber(formattedValue);
      setFormData({
        ...formData,
        PlateNumber: formattedValue,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormData({
      ...formData,
      membershipStatus: formData.NoCard ? 'extend' : 'new',
      namaProduk: selectedProduct, // Update namaProduk di formData sebelum submit
    });

    // if (!formData.NoCard) {
    //   setFormData({
    //     ...formData,
    //     membershipStatus: 'new',
    //   });
    // } else {
    //   setFormData({
    //     ...formData,
    //     membershipStatus: 'extend',
    //   });
    // }

    console.log(formData);
    setShowModal(true);
  };

  const handlePaymentFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setPaymentFile(files[0]);
    }
  };

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      'galihtanjungtresna'
    ).toString();
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      console.log(formData);
      const finalPayload = {
        ...formData,
        licensePlate: files.licensePlate ? files.licensePlate.name : null,
        stnk: files.stnk ? files.stnk.name : null,
        paymentFile: paymentFile ? paymentFile.name : null,
      };

      const encryptedPayload = encryptData(finalPayload);

      const formPayload = new FormData();
      formPayload.append('encryptedPayload', encryptedPayload);

      if (files.licensePlate) {
        formPayload.append('licensePlate', files.licensePlate);
      }
      if (files.stnk) {
        formPayload.append('stnk', files.stnk);
      }
      if (paymentFile) {
        formPayload.append('paymentFile', paymentFile);
      }
      const response = await getTransaction.createData(formPayload);

      if (response.status === true) {
        setStatusResponse(response.status);
        setMessage(response.message);
        setShowModalSubmit(true);
      } else {
        setStatusResponse(response.status);
        setMessage(response.message);
        setShowModalSubmit(true);
      }

      setLoading(false);
      setShowModal(false);
    } catch (error) {
      setError(`${error.message}`);
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const closeModalSubmit = () => {
    setShowModalSubmit(false);
    setFormData({
      fullname: '',
      phonenumber: '+62',
      email: '',
      NoCard: '',
      membershipStatus: '',
      vehicletype: '',
      locationCode: '',
      noRek: '',
      namaRek: '',
    });
    setFiles({
      licensePlate: null,
      stnk: null,
      paymentFile: null,
    });
    setQuota('');
    setShowEdit(false);
    setPlatNumber('');
    navigate('/');
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setError(null);
  };

  const closePopupModal = () => {
    setShowModal(false);
    setPriceMember(0);
  };

  const handleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="sm:max-w-[90%] max-w-full mx-auto bg-white rounded-xl space-y-4 mt-10 md:max-w-[100%] m-0"
      >
        <div className="space-y-4">
          <div className="flex flex-col justify-start items-start">
            <label
              htmlFor="NoCard"
              className="text-xs bg-blue-100 px-2 py-3 rounded-md mb-2 w-full"
            >
              Masukan no kartu jika sudah mempunyai member
            </label>
            <input
              type="text"
              name="NoCard"
              id="NoCard"
              placeholder="Nomor Kartu"
              value={formData.NoCard}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Nama Member"
            value={formData.fullname}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="EmailRegister"
            required
          />
          <div className="flex flex-col justify-start items-start">
            <label
              htmlFor="phonenumber"
              className="text-xs bg-blue-100 px-2 py-3 rounded-md mb-2 w-full"
            >
              Pastikan no handphone terhubung Whatsapp
            </label>
            <input
              type="text"
              name="phonenumber"
              id="phonenumber"
              maxLength={18}
              placeholder="No Handphone"
              value={formData.phonenumber}
              onChange={handlePhoneNumberChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <label htmlFor="locationCode" className="block text-gray-700">
            Lokasi:
          </label>
          <div onScroll={handleScroll}>
            <select
              name="locationCode"
              value={formData.locationCode}
              id="locationCode"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Pilih Kode Lokasi</option>
              {locations.map((location) => (
                <option key={location.id} value={location.locationCode}>
                  {location.locationName}
                </option>
              ))}
            </select>
            {loading && <p>Loading more locations...</p>}
          </div>

          {formData.locationCode && (
            <>
              <label htmlFor="vehicletype" className="block text-gray-700">
                Tipe Kendaraan:
              </label>
              <select
                name="vehicletype"
                value={formData.vehicletype}
                id="vehicletype"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Pilih Tipe Kendaraan</option>
                <option
                  value="MOBIL"
                  disabled={quota?.QuotaMobilRemaining === 0}
                >
                  Mobil{' '}
                  {quota?.QuotaMobilRemaining === 0
                    ? 'Quota habis'
                    : `(${quota.QuotaMobilRemaining} slot)`}
                </option>
                <option
                  value="MOTOR"
                  disabled={quota?.QuotaMotorRemaining === 0}
                >
                  Motor{' '}
                  {quota?.QuotaMotorRemaining === 0
                    ? 'Quota habis'
                    : `(${quota.QuotaMotorRemaining} slot)`}
                </option>
              </select>
            </>
          )}

          <input
            type="text"
            name="namaRek"
            placeholder="Rekening atas nama"
            value={formData.namaRek}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="noRek"
            placeholder="Nomor rekening"
            value={formData.noRek}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="space-y-2 relative">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="licensePlate" className="block text-gray-700">
                <p>Upload Foto Plat Nomor:</p>
              </label>
              <IoMdInformationCircleOutline
                className="hover:text-blue-600"
                onClick={handleInfo}
              />
            </div>
            {showInfo && (
              <>
                <div className="absolute w-60 max-h-72 rounded-md bg-blue-100 right-5 -top-24 p-2">
                  <img
                    src={'/examplePlate.webp'}
                    className="w-full rounded-md"
                    alt=""
                  />
                </div>
              </>
            )}

            <input
              type="file"
              name="licensePlate"
              id="licensePlate"
              className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              onChange={handlePlatUpload}
              accept=".png, .jpg, .jpeg"
              required
            />
            <input
              type="text"
              value={platNumber}
              placeholder="Plat Nomor"
              name="platNumber"
              id="plateNumber"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
              disabled={!editEnabled}
              readOnly
            />
            {loadingPlate && (
              <div className="absolute right-0 top-24 mt-3 mr-5 flex items-center">
                <div className="loader"></div>
              </div>
            )}
            {!loadingPlate && editEnabled && (
              <button
                type="button"
                className="absolute right-0 top-24 mt-3 mr-5 text-blue-500"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="stnk" className="block text-gray-700">
              Upload STNK:
            </label>
            <input
              type="file"
              name="stnk"
              id="stnk"
              className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              onChange={handleFileChange}
              accept=".png, .jpg, .jpeg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>

      {showEdit && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Plat Nomor</h2>
            <input
              type="text"
              className="block w-full rounded-md border-0 mt-3 py-3 pl-5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="ex : B123ABC"
              value={platNumber}
              onChange={handleChange}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
                onClick={closePopup}
              >
                Simpan
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
                onClick={closePopup}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-5"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Upload Bukti Pembayaran
            </h2>
            <div className="border-b border-slate-400 w-full"></div>
            <div className="flex flex-row justify-start items-center space-x-2 font-semibold my-4">
              <CiLocationOn />
              <span>{locationName}</span>
            </div>

            <select
              name="locationPrice"
              id="locationPrice"
              onChange={(e) => {
                const selectedOption = JSON.parse(e.target.value);
                setPriceMember(selectedOption.price);
                setSelectedProduct(selectedOption.namaProduk);
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  namaProduk: selectedOption.namaProduk,
                }));
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
                      formData.vehicletype === 'MOBIL'
                        ? location.priceMobil
                        : location.priceMotor,
                    namaProduk: location.namaProduk,
                  })}
                >
                  {location.namaProduk}
                </option>
              ))}
            </select>

            <div className="mb-4">
              <h1>Silahkan lakukan pembayaran ke virtual account berikut: </h1>
              <p className="text-base font-semibold my-3">
                AN/. UPHC (Membership UPH Collage)
              </p>
              <p className="text-xl font-semibold mb-2">{virtualAccount}</p>
              <p className="text-xl font-semibold">
                {currencyFormat(priceMember)}
              </p>
            </div>
            <div className="mb-4">
              <input
                type="file"
                name="paymentFile"
                className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                onChange={handlePaymentFileChange}
                accept=".png, .jpg, .jpeg"
                required
              />
            </div>

            {loadingPlate ? (
              <div className="absolute right-0 top-24 mt-3 mr-5 flex items-center">
                <div className="loader"></div>
              </div>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit
              </button>
            )}

            <button
              onClick={closePopupModal}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300 mt-2"
            >
              close
            </button>
          </div>
        </div>
      )}

      {showModalSubmit && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-3"
          style={{ margin: 0 }}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-4">
            {statusResponse === true ? (
              <>
                <GoChecklist className="w-20 h-20 text-green-500" />
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-lg font-semibold">Terimakasih</h2>
                  <h2 className="text-lg font-semibold">
                    Pendaftaran kamu berhasil
                  </h2>
                </div>
                {formData.membershipStatus === 'new' ? (
                  <>
                    <p className="text-center">
                      Mohon ditunggu untuk informasi selanjutnya dan pastikan
                      nomor anda terhubung dengan whatsapp
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-center">
                      Mohon ditunggu untuk informasi pengaktifan member anda dan
                      pastikan nomor handphon terhubung dengan whatsapp
                    </p>
                  </>
                )}
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
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-4 text-center">
            <GoAlert size={40} className="text-red-500" />
            <h2 className="text-lg font-semibold mb-4">Pendaftaran Gagal</h2>
            <h2 className="text-sm mb-4">{error}</h2>
            <button
              onClick={closeErrorPopup}
              className="bg-red-500 text-white p-3 rounded-lg w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
