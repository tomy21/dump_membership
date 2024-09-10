import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { apiUsers } from '../api/apiUsers';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const token = Cookies.get('refreshToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;
        try {
          const responseRole = await apiUsers.getRoleById(userId);
          setRoleId(responseRole.data?.RoleId);
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      }
    };

    fetchRole();
  }, []);

  return <RoleContext.Provider value={roleId}>{children}</RoleContext.Provider>;
};

RoleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
