import React from "react";
import CustomerForm from "../components/CustomerForm";

const CustomerPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Customer Services</h1>
      <CustomerForm />
    </div>
  );
};

export default CustomerPage;
