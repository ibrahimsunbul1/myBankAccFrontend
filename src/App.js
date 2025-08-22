import React, { useState } from 'react';
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

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
  };

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
