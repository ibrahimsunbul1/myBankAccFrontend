import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Accounts from './components/Accounts';
import MoneyTransfer from './components/MoneyTransfer';
import Payments from './components/Payments';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const fullName = userData.firstName && userData.lastName ? 
          userData.firstName + ' ' + userData.lastName : 
          userData.username;
        setCurrentUser(fullName);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('No active session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsLoggedIn(false);
    setCurrentUser('');
  };

  if (isLoading) {
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/accounts" element={<Accounts currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/transfer" element={<MoneyTransfer currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/payments" element={<Payments currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
