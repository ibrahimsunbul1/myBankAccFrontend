import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Register from './Register';
import { useUser } from '../context/UserContext';

function Login() {
  const { login, error: contextError, loading: contextLoading, clearError } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  
  // Context'ten gelen error'ı kullan, yoksa local error'ı kullan
  const error = contextError || localError;
  const isLoading = contextLoading;



  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setLocalError('');
      clearError();
    }
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
      setLocalError('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Validate input format
    if (!validateTcOrCustomerNumber(formData.username)) {
      setLocalError('Kullanıcı adı en az 3 karakter olmalı veya TC/Müşteri numarası 11 haneli olmalı ve 0 ile başlamamalıdır');
      return;
    }

    // Context'teki login fonksiyonunu kullan
    const result = await login({
      username: formData.username,
      password: formData.password
    });
    
    if (result && result.success) {
      // Login başarılı, doğrudan yönlendir
      navigate('/', { replace: true });
    } else {
      setLocalError(result?.error || 'Kullanıcı adı veya şifre hatalı');
    }
  };
  
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const handleRegistrationClick = () => {
    setShowRegisterPage(true);
  };

  const handleBackToLogin = () => {
    setShowRegisterPage(false);
    setLocalError('');
    clearError();
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