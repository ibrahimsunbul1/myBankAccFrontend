import React, { useState } from 'react';
import './Register.css';

function Register({ onRegister, onBackToLogin }) {
  const [formData, setFormData] = useState({
    tcKimlik: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For TC Kimlik field, only allow digits and limit to 11 characters
    if (name === 'tcKimlik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (name === 'phone') {
      // For phone field, only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateTcKimlik = (tc) => {
    if (tc.length !== 11) return false;
    if (tc[0] === '0') return false;
    
    // TC Kimlik validation algorithm
    const digits = tc.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const check1 = ((sum1 * 7) - sum2) % 10;
    const check2 = (sum1 + sum2 + digits[9]) % 10;
    
    return check1 === digits[9] && check2 === digits[10];
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.tcKimlik || !formData.firstName || !formData.lastName || 
        !formData.email || !formData.phone || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    
    // Validate TC Kimlik
    if (!validateTcKimlik(formData.tcKimlik)) {
      setError('Geçerli bir TC Kimlik Numarası girin');
      return;
    }
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }
    // Validate phone
    if (formData.phone.length !== 10) {
      setError('Telefon numarası 10 haneli olmalıdır');
      return;
    }
      
      // Validate password
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          tcKimlikNo: formData.tcKimlik,
          phoneNumber: formData.phone
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Registration successful
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        onBackToLogin();
      } else {
        const errorData = await response.json();
        // Registration failed
        setError(errorData.error || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-card">
          <div className="register-header">
            <h1 className="bank-logo">MyBank</h1>
            <p className="register-subtitle">Yeni Müşteri Kaydı</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="tcKimlik"
                  value={formData.tcKimlik}
                  onChange={handleChange}
                  placeholder="T.C. Kimlik Numarası"
                  disabled={isLoading}
                  maxLength="11"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Kullanıcı Adı"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Adınız"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta Adresiniz"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefon Numaranız (10 haneli)"
                  disabled={isLoading}
                  maxLength="10"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifreniz (en az 6 karakter)"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifrenizi Tekrar Girin"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="button-group">
              <button 
                type="submit" 
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              </button>
              
              <button 
                type="button" 
                className="back-button"
                onClick={onBackToLogin}
                disabled={isLoading}
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;