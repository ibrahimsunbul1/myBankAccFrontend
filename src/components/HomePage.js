import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage({ currentUser, onLogout }) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [fixedDeposit, setFixedDeposit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Kullanıcı hesaplarını çek (auth kontrolü App.js'te yapılıyor)
      const accountsResponse = await fetch('http://localhost:8080/api/accounts', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        
        // Toplam bakiye hesapla
        let total = 0;
        let available = 0;
        let fixed = 0;
        
        accountsData.forEach(account => {
          total += parseFloat(account.balance || 0);
          if (account.accountType === 'SAVINGS') {
            available += parseFloat(account.balance || 0);
          } else if (account.accountType === 'FIXED_DEPOSIT') {
            fixed += parseFloat(account.balance || 0);
          }
        });
        
        setTotalBalance(total);
        setAvailableBalance(available);
        setFixedDeposit(fixed);
      }
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-content">
          <h1>Banka Hesap Yönetimi</h1>
          <div className="user-info">
            <span>Hoş geldiniz, {currentUser}</span>
            <button onClick={onLogout} className="logout-btn">Çıkış Yap</button>
          </div>
        </div>
      </header>
      
      <div className="main-layout">






        {/* Dropdown Menu Toggle Button */}
        <div className="dropdown-menu-container">
          <button 
            className="dropdown-toggle-btn" 
            onClick={toggleSidebar}
            aria-label="Menüyü Aç/Kapat"
          >
            <span className="toggle-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>

          {/* Dropdown Menu */}
          {isSidebarOpen && (
            <div className="dropdown-menu">
              <ul className="dropdown-menu-list">
                <li>
                  <button onClick={() => { navigate('/'); setIsSidebarOpen(false); }} className="dropdown-link">
                    <span className="nav-icon">🏠</span>
                    Ana Sayfa
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate('/payments'); setIsSidebarOpen(false); }} className="dropdown-link">
                    <span className="nav-icon">💳</span>
                    Ödemeler
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate('/transfer'); setIsSidebarOpen(false); }} className="dropdown-link">
                    <span className="nav-icon">💸</span>
                    Para Transferi
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate('/accounts'); setIsSidebarOpen(false); }} className="dropdown-link">
                    <span className="nav-icon">🏦</span>
                    Hesaplarım
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <main className="main-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1>Hoş Geldiniz, {currentUser}</h1>
              <p>Bankacılık işlemlerinizi güvenle gerçekleştirin</p>
            </div>
          </section>

          {/* Account Summary */}
          <section className="account-summary">
            <h2>Hesap Özeti</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-header">
                  <h3>Toplam Bakiye</h3>
                </div>
                <div className="card-amount">₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Kullanılabilir Bakiye</h3>
                </div>
                <div className="card-amount">₺{availableBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Vadeli Hesap</h3>
                </div>
                <div className="card-amount">₺{fixedDeposit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="services-section">
            <h2>Bankacılık Hizmetleri</h2>
            <div className="services-grid">
              <div className="service-item">
                <div className="service-icon">💳</div>
                <h4>Kart İşlemleri</h4>
                <p>Kredi kartı ve banka kartı işlemleri</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon">💰</div>
                <h4>Krediler</h4>
                <p>İhtiyaç, konut ve taşıt kredileri</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon">📊</div>
                <h4>Yatırım</h4>
                <p>Mevduat ve yatırım ürünleri</p>
              </div>
              
              <div className="service-item">
                <div className="service-icon">🏦</div>
                <h4>Şube İşlemleri</h4>
                <p>Şube ve ATM hizmetleri</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <footer className="main-footer">
        <p>&copy; 2024 Banka Hesap Yönetimi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default HomePage;