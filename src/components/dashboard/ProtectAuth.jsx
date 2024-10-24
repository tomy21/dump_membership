import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { apiUsers } from '../../api/apiUsers';

export default function ProtectAuth({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiUsers.verifyToken();
        // Pastikan response mengandung statusCode
        if (response.status === 'success') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/login');
      }

      setAuthChecked(true);
    };

    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, navigate]);

  // Jangan render apapun sampai otentikasi diperiksa
  if (!authChecked) {
    return null;
  }

  // Render anak-anak jika otentikasi berhasil
  return isAuthenticated ? children : null;
}

ProtectAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
