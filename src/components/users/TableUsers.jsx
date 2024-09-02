import React, { useEffect, useState } from 'react';
import { apiUsers } from '../../api/apiUsers';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import Loading from '../Loading';

export default function TableUsers() {
  const [dataUsers, setDataUsers] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchData, setSearchData] = useState('');
  const [totalRows, setTotalRows] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    pin: '',
    roleId: '',
  });

  const getAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiUsers.getData(pages, limit);
      setCurrentPage(response.currentPage);
      setTotalPage(response.totalPages);
      setTotalRows(response.total);
      setDataUsers(response.data);
      console.log(response);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
    getRoleUser();
  }, [pages, limit]);

  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPage) {
      setPages(page);
    }
  };

  const addHandle = () => {
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
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
    setIsLoading(true);
    try {
      const response = await apiUsers.register(formData);
      console.log('User added:', response);
      setIsSuccess(true);
      setAddModal(false);
      getAllUsers();
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding user:', error);
      setIsLoading(false);
    }
  };

  const getRoleUser = async () => {
    setIsLoading(true);
    try {
      const response = await apiUsers.getRole();
      console.log(response);
      setUserRole(response.data.roles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding user:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Search and Export */}
        <div className="flex justify-between items-center mb-4">
          <input
            value={searchData}
            onChange={handleSearch}
            placeholder="Search..."
            className="p-2 border rounded-md w-60"
          />
          <button
            onClick={addHandle}
            className="px-5 py-2 bg-blue-500 text-white text-sm rounded-md shadow-md hover:bg-blue-700"
          >
            Add Users
          </button>
        </div>
        {/* Table */}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                User Name
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="py-3 px-4 bg-gray-100 border-b text-left text-sm font-semibold text-gray-700">
                PhoneNumber
              </th>
            </tr>
          </thead>
          <tbody>
            {dataUsers.length > 0 ? (
              dataUsers.map((member, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {member.UserName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {member.Email}
                  </td>

                  <td className="py-2 px-4 border-b text-sm text-gray-700">
                    {member.PhoneNumber}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  Data Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Page{' '}
              <strong>
                {currentPage} of {totalPage}
              </strong>{' '}
            </span>
          </div>

          <div className="flex flex-row justify-center items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border p-2 rounded-md"
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md bg-gray-200"
              >
                <FaArrowLeftLong />
              </button>
              <div className="flex flex-row justify-end items-center gap-x-3">
                {Array.from({ length: totalPage }).map((_, i) => {
                  if (
                    totalPage > 10 &&
                    (i + 1 === 2 || i + 1 === totalPage - 1)
                  ) {
                    return (
                      <span key={i} className="px-3 py-1 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  if (totalPage > 10 && i + 1 > 2 && i + 1 < totalPage - 1) {
                    return null;
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageClick(i + 1)}
                      className={`px-3 py-1 border rounded-md ${
                        i + 1 === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    handlePageClick(Math.min(currentPage + 1, totalPage))
                  }
                  disabled={currentPage === totalPage}
                  className="px-3 py-1 border rounded-md bg-gray-200"
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            Total Rows: <span className="font-bold">{totalRows}</span>
          </p>
        </div>

        {addModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-3">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  placeholder="PIN"
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-4"
                  required
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {userRole.map((role) => (
                    <option key={role.Id} value={role.Id}>
                      {role.Name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add User'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-lg font-semibold">Add Data Berhasil</h2>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
