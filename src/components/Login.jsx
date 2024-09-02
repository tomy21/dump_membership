import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Loading from './Loading';
import { MdOutlineRefresh } from 'react-icons/md';
import { apiUsers } from '../api/apiUsers';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const refreshString = () => {
    setCaptcha(Math.random().toString(36).slice(2, 8));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.identifier) errors.identifier = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    if (inputCaptcha !== captcha) errors.captcha = 'Captcha does not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    refreshString();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await apiUsers.login(formData);
        setFormErrors({});
        setFormData({
          identifier: '',
          password: '',
          rememberMe: false,
        });

        const token = response.token;
        Cookies.set('refreshToken', token);
        setTimeout(() => {
          navigate('/admin');
          toast.success('Login successful!');
        }, 500);

        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      if (formErrors.captcha) {
        toast.error('Captcha does not match!');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="flex flex-row justify-start items-center space-x-3 mb-4">
          <img src={'/logo.png'} className="w-20" alt="logo skyparking" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">SKY Membership</h2>
            <p className="text-gray-600 text-sm">Admin Login</p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start mb-4">
          <h1 className="text-base font-semibold">Selamat datang kembali</h1>
          <p className="text-sm text-slate-400">
            Silahkan login untuk melakukan aktifitas
          </p>
        </div>
        <div className="border-b border-slate-300 mb-4"></div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center gap-y-3"
        >
          <input
            type="text"
            placeholder="Email atau username"
            className="p-2 border w-full rounded-md"
            value={formData.identifier}
            onChange={handleChange}
            name="identifier"
            autoComplete="username"
          />
          {formErrors.identifier && (
            <p className="text-red-500 text-xs">{formErrors.identifier}</p>
          )}
          <input
            type="password"
            placeholder="Password"
            className="p-2 border w-full rounded-md"
            value={formData.password}
            onChange={handleChange}
            name="password"
            autoComplete="current-password"
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs">{formErrors.password}</p>
          )}

          <div className="relative w-full select-none overflow-hidden">
            {/* Background Lines */}
            <div className="absolute w-full h-[40px] flex items-center justify-between">
              <div className="w-[120%] h-[1px] bg-gray-400 rotate-45"></div>
              <div className="w-[120%] h-[1px] bg-gray-400 -rotate-45"></div>
            </div>

            {/* CAPTCHA Text */}
            <div className="relative text-white font-semibold w-full h-[40px] px-1 rounded-md text-3xl tracking-[15px] flex items-center justify-center">
              <span
                className="transform rotate-[5deg] text-yellow-400"
                style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
              >
                {captcha}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              className="absolute top-2 right-5"
              onClick={refreshString}
            >
              <MdOutlineRefresh />
            </button>
          </div>

          <input
            type="text"
            className="w-full py-2 px-3 border border-slate-300 bg-slate-100 rounded-md"
            placeholder="Captcha"
            value={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
          />
          {formErrors.captcha && (
            <p className="text-red-500 text-xs">{formErrors.captcha}</p>
          )}

          <div className="flex justify-between items-center w-full">
            <div className="flex flex-row space-x-2 justify-center items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <p className="text-xs">Ingat saya</p>
            </div>
            <p className="text-cyan-600 font-semibold text-xs">
              Lupa password ?
            </p>
          </div>

          <button className="bg-blue-500 text-white p-2 rounded w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
