import React, { useState } from 'react';
import RegistrationForm from './form/RegistrationForm';
import RenewalForm from './form/RenewalForm';

const CustomerForm = () => {
  const [formType, setFormType] = useState('');

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  return (
    <div className="p-6 sm:max-w-[90%] max-w-full mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10 md:max-w-[40%]">
      <div className="flex flex-row justify-start items-center space-x-5">
        <img src={'/logo.png'} className="w-20" alt="logo skyparking" />
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formType}
          onChange={handleFormTypeChange}
        >
          <option className="text-sm" value="">
            Pilih Layanan
          </option>
          <option className="text-sm" value="daftar">
            Daftar Member
          </option>
          <option className="text-sm" value="extend">
            Perpanjang
          </option>
        </select>
      </div>

      {formType === 'daftar' && <RegistrationForm />}
      {formType === 'extend' && <RenewalForm />}
    </div>
  );
};

export default CustomerForm;
