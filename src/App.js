import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import CustomerPage from './pages/CustomerPage';
import Login from './components/Login';
import MutasiPage from './pages/MutasiPage';
import UserManagement from './pages/UserManagement';
import Header from './components/dashboard/Header';
import ProtectAuth from './components/dashboard/ProtectAuth';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const showHeader =
    location.pathname !== '/' && location.pathname !== '/login';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectAuth>
              <AdminPage />
            </ProtectAuth>
          }
        />
        <Route
          path="/customer"
          element={
            <ProtectAuth>
              <CustomerPage />
            </ProtectAuth>
          }
        />
        <Route
          path="/mutasi"
          element={
            <ProtectAuth>
              <MutasiPage />
            </ProtectAuth>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectAuth>
              <UserManagement />
            </ProtectAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
