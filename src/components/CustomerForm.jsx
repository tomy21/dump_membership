import React, { useState } from "react";

const CustomerForm = () => {
  const [formType, setFormType] = useState(""); // Tidak ada form default
  const [platNumber, setPlatNumber] = useState("");

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  const handlePlatUpload = (e) => {
    // Logika untuk membaca plat nomor dari gambar
    const plat = "B1234XYZ"; // Contoh hasil OCR dari gambar
    setPlatNumber(plat);
  };

  return (
    <div className="p-6 sm:max-w-[90%] max-w-full mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 md:max-w-[40%]">
      <div className="flex flex-row justify-start items-center space-x-5">
        <img src={"/logo.png"} className="w-20" alt="logo skyparking" />
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold">Selamat datang,</h1>
          <p className="text-sm text-slate-400">
            Dilayanan membership SKY PARKING
          </p>
        </div>
      </div>
      <div className="border-b border-gray-400"></div>

      <div className="flex flex-col justify-center mb-4">
        <label className="text-gray-700 text-sm font-bold mb-2">
          Pilih Layanan:
        </label>
        <select
          className="block w-full p-2 border border-gray-300 rounded-lg text-sm"
          value={formType}
          onChange={handleFormTypeChange}
        >
          <option className="text-sm" value="">
            Pilih Layanan
          </option>
          <option lassName="text-sm" value="daftar">
            Daftar Member
          </option>
          <option lassName="text-sm" value="perpanjang">
            Perpanjang
          </option>
        </select>
      </div>

      {formType && (
        <div className="space-y-4">
          {formType === "daftar" ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama Member"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="No Handphone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="space-y-2">
                <label className="block text-gray-700">
                  Upload Foto Plat Nomor:
                </label>
                <input
                  type="file"
                  className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                  onChange={handlePlatUpload}
                />
                <input
                  type="text"
                  value={platNumber}
                  placeholder="Plat Nomor"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700">Upload STNK:</label>
                <input
                  type="file"
                  className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nomor Kartu"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="No Telepon"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="space-y-2">
                <label className="block text-gray-700">
                  Upload Bukti Transfer:
                </label>
                <input
                  type="file"
                  className="block w-full text-gray-900 p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
              </div>
            </div>
          )}

          <button className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
