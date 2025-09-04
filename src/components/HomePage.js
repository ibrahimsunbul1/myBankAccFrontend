import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { useUser } from '../context/UserContext';
import { getAllFinancialData, formatNumber } from '../services/financialService';
import FinancialChart from './FinancialChart';
// API imports removed as they are not used

function HomePage({ currentUser, onLogout }) {
  const { user, balance, accounts, loading: userLoading } = useUser();
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    fixedDeposit: 0,
    recentActivity: []
  });
  const [financialData, setFinancialData] = useState({
    exchangeRates: { usdToTry: 0, eurToTry: 0 },
    goldPrices: { goldPerOunce: 0, goldPerGram: 0 },
    bistData: { value: 0, change: 0, changePercent: 0 }
  });
  // Removed static loading state - using only userLoading from context
  const [error] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const fetchDashboardData = useCallback(async () => {
    // Backend'te dashboard endpoint'i olmadığı için context'ten veri hesapla
    const calculatedData = {
      totalBalance: balance || 0,
      accountCount: accounts ? accounts.length : 0,
      recentTransactions: [
        { id: 1, description: 'Market Alışverişi', amount: -125.50, date: '2024-01-15' },
        { id: 2, description: 'Maaş Yatırımı', amount: 5000.00, date: '2024-01-14' },
        { id: 3, description: 'Elektrik Faturası', amount: -180.75, date: '2024-01-13' }
      ],
      monthlySpending: 1250.75,
      monthlyIncome: 5000.00
    };
    setDashboardData(calculatedData);
  }, [balance, accounts]);

  const fetchFinancialData = useCallback(async () => {
    try {
      const data = await getAllFinancialData();
      setFinancialData(data);
    } catch (error) {
      console.error('Finansal veriler yüklenirken hata:', error);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData();
      fetchFinancialData();
      
      // Finansal verileri her 5 dakikada bir güncelle
      const financialInterval = setInterval(() => {
        fetchFinancialData();
      }, 5 * 60 * 1000); // 5 dakika
      
      // Cleanup function
      return () => {
        clearInterval(financialInterval);
      };
    }
  }, [user, balance, accounts, fetchDashboardData, fetchFinancialData]);



  if (userLoading) {
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
            
            {/* Finansal Veriler */}
            <div className="financial-data-cards">
              <div className="financial-card">
                <div className="financial-icon">💵</div>
                <div className="financial-info">
                  <h4>USD/TRY</h4>
                  <div className="financial-value">{formatNumber(financialData.exchangeRates.usdToTry)}</div>
                </div>
              </div>
              
              <div className="financial-card">
                <div className="financial-icon">💶</div>
                <div className="financial-info">
                  <h4>EUR/TRY</h4>
                  <div className="financial-value">{formatNumber(financialData.exchangeRates.eurToTry)}</div>
                </div>
              </div>
              
              <div className="financial-card">
                <div className="financial-icon">🥇</div>
                <div className="financial-info">
                  <h4>Altın (Ons)</h4>
                  <div className="financial-value">${formatNumber(financialData.goldPrices.goldPerOunce)}</div>
                </div>
              </div>
              
              <div className="financial-card">
                <div className="financial-icon">📈</div>
                <div className="financial-info">
                  <h4>BIST 100</h4>
                  <div className="financial-value">{formatNumber(financialData.bistData.value)}</div>
                  <div className={`financial-change ${financialData.bistData.change >= 0 ? 'positive' : 'negative'}`}>
                    {financialData.bistData.change >= 0 ? '+' : ''}{formatNumber(financialData.bistData.change)} 
                    ({financialData.bistData.changePercent >= 0 ? '+' : ''}{formatNumber(financialData.bistData.changePercent)}%)
                  </div>
                </div>
              </div>
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
                <div className="card-amount">₺{(dashboardData.totalBalance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Kullanılabilir Bakiye</h3>
                </div>
                <div className="card-amount">₺{(dashboardData.availableBalance || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Vadeli Hesap</h3>
                </div>
                <div className="card-amount">₺{(dashboardData.fixedDeposit || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </section>

          {/* Finansal Piyasa Grafikleri */}
          <section className="financial-charts-section">
            <FinancialChart />
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