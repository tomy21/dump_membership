import React, { useEffect } from 'react';
import CustomerForm from '../components/CustomerForm';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentDay > 5 && currentDay <= 19) {
      navigate('/expired');
    }
  }, [currentDay, navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-5 px-3">
      <CustomerForm />
    </div>
  );
};

export default LandingPage;
