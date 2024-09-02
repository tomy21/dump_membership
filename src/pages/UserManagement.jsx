import React from 'react';
import UserContent from '../components/users/UserContent';

export default function UserManagement() {
  return (
    <>
      <div className="max-h-screen bg-gray-100 overflow-hidden">
        <div className="max-h-[90vh] overflow-auto">
          <UserContent />
        </div>
      </div>
    </>
  );
}
