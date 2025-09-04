import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { UserProvider, useUser } from './context/UserContext';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Accounts from './components/Accounts';
import MoneyTransfer from './components/MoneyTransfer';
import Payments from './components/Payments';

// Ana App Bileşeni - Context içinde çalışır
function AppContent() {
  const { isAuthenticated, loading, user, logout } = useUser();

  if (loading) {
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  const currentUser = user ? 
    (user.firstName && user.lastName ? 
      `${user.firstName} ${user.lastName}` : 
      user.username) : '';

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} onLogout={logout} />} />
          <Route path="/accounts" element={<Accounts currentUser={currentUser} onLogout={logout} />} />
          <Route path="/transfer" element={<MoneyTransfer currentUser={currentUser} onLogout={logout} />} />
          <Route path="/payments" element={<Payments currentUser={currentUser} onLogout={logout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </div>
  );
}

// Ana App Bileşeni - UserProvider ile sarılmış
function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
