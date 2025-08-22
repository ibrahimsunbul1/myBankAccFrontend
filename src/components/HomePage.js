import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ currentUser, onLogout }) {
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
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/" className="active">Ana Sayfa</Link></li>
            <li><Link to="/accounts">Hesaplarım</Link></li>
            <li><Link to="/transfer">Para Transferi</Link></li>
            <li><Link to="/payments">Ödemeler</Link></li>
          </ul>
        </nav>
        
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
                <div className="card-amount">₺68,250.50</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Kullanılabilir Bakiye</h3>
                </div>
                <div className="card-amount">₺15,750.50</div>
              </div>
              
              <div className="summary-card">
                <div className="card-header">
                  <h3>Vadeli Hesap</h3>
                </div>
                <div className="card-amount">₺50,000.00</div>
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