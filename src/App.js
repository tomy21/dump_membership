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
import { RoleProvider } from './pages/RoleContext';
import Header from './components/dashboard/Header';

function App() {
  return (
    <RoleProvider>
      <Router>
        <MainContent />
      </Router>
    </RoleProvider>
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/mutasi" element={<MutasiPage />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </>
  );
}

export default App;
