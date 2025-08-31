import React, { useState } from 'react';
import './Login.css';
import Register from './Register';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const validateTcOrCustomerNumber = (input) => {
    // If input is 11 digits, validate as TC/Customer number
    if (/^\d{11}$/.test(input)) {
      // First digit cannot be 0
      if (input.charAt(0) === '0') {
        return false;
      }
      return true;
    }
    
    // If not 11 digits, allow as username (minimum 3 characters)
    return input.length >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Validate input format
    if (!validateTcOrCustomerNumber(formData.username)) {
      setError('Kullanıcı adı en az 3 karakter olmalı veya TC/Müşteri numarası 11 haneli olmalı ve 0 ile başlamamalıdır');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Login successful - sadece onLogin çağır, diğer işlemler App.js'te yapılacak
        const fullName = data.firstName && data.lastName ? 
          data.firstName + ' ' + data.lastName : 
          data.username;
        onLogin(fullName);
        return; // Başarılı login sonrası hemen çık
      } else {
        // Login failed
        setError(data.error || 'Kullanıcı adı veya şifre hatalı');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const handleRegistrationClick = () => {
    setShowRegisterPage(true);
  };

  const handleBackToLogin = () => {
    setShowRegisterPage(false);
    setError('');
  };

  if (showRegisterPage) {
    return <Register onBackToLogin={handleBackToLogin} />;
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <h1 className="bank-logo">MyBank</h1>
            <p className="login-subtitle">Güvenli Bankacılık Sistemi</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Kullanıcı Adı / T.C. Kimlik / Müşteri Numaranız"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Şifrenizi girin"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
            
            <button 
              type="button" 
              className="register-button"
              onClick={handleRegistrationClick}
              disabled={isLoading}
            >
              Kayıt Ol
            </button>
          </form>
          
          <div className="login-footer">
            <p>Test için: TC: 12345678901 veya 98765432109, Şifre: password123 veya admin123</p>
            <p className="input-info">Kullanıcı adınızı veya 11 haneli TC Kimlik/Müşteri Numaranızı giriniz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;