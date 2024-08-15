import React from "react";
import CustomerForm from "../components/CustomerForm";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-5 px-3">
      <CustomerForm />
    </div>
  );
};

export default LandingPage;
