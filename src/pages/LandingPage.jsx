import React from 'react';
// import CustomerForm from '../components/CustomerForm';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // const currentDate = new Date();
  // const currentDay = currentDate.getDate();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (currentDay > 5 && currentDay <= 19) {
  //     navigate('/expired');
  //   }
  // }, [currentDay, navigate]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          🎉 Membership Telah Berpindah!
        </h1>
        <p className="text-lg mb-6 leading-relaxed">
          Sekarang, pendaftaran dan pengelolaan <strong>Membership</strong>{' '}
          SkyParking dilakukan melalui website resmi kami.
        </p>
        <p className="text-lg mb-6 leading-relaxed">
          Jika anda sudah menggunakan website lama, di website baru anda tinggal
          lakukan lupa password lalu, masukan email anda, klik ganti password
          dan masukan password baru. Setelah itu laogin kembali
        </p>

        <motion.a
          href="https://membership.skyparking.online"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Kunjungi Website Baru
        </motion.a>
      </motion.div>

      <motion.div
        className="absolute bottom-6 text-sm text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} SkyParking. All rights reserved.
      </motion.div>
    </main>
  );
};

export default LandingPage;
