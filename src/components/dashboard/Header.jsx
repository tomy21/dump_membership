import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Default import
import { getUserById } from "../../api/apiUsers";

const Header = () => {
  const [userName, setUserName] = useState("");
  const [idUser, setIdUser] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const token = Cookies.get("refreshToken");
      if (!token) {
        navigate("/");
      }
      if (token) {
        const decodedToken = jwtDecode(token);
        setIdUser(decodedToken.Id);
      }
    };
    fetchToken();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (idUser) {
        const response = await getUserById.userById(idUser);
        const userName = response.data.UserName;
        setName(userName);
        setEmail(response.data.Email);

        // Generate initials from userName
        const nameParts = userName.split(" ");
        const initials = nameParts
          .map((part) => part[0])
          .join("")
          .toUpperCase();
        setUserName(initials);
      }
    };

    fetchUser();
  }, [idUser]);

  return (
    <header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-5">
        <img src="/logo.png" alt="logo" className="w-16" />
      </div>
      <div className="relative">
        <Menu as="div" className="relative inline-block text-left">
          <div className="flex flex-row justify-end items-center space-x-2">
            <div className="flex flex-col justify-end items-end space-x-2">
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs font-light">{email}</p>
            </div>
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-orange-500 text-xl font-medium text-white hover:bg-orange-600 focus:outline-none">
                <span>{userName}</span>
              </Menu.Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#profile"
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block px-4 py-2 text-sm`}
                    >
                      Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#logout"
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } block px-4 py-2 text-sm`}
                    >
                      Logout
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
