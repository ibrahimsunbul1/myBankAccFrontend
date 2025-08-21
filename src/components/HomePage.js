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
            <li><a href="#cards">Kartlarım</a></li>
            <li><a href="#loans">Krediler</a></li>
          </ul>
        </nav>
        
        <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Hesap Özeti</h2>
            <div className="account-cards">
              <div className="account-card">
                <h3>Vadesiz Hesap</h3>
                <p className="account-number">****1234</p>
                <p className="balance">₺15,750.50</p>
              </div>
              <div className="account-card">
                <h3>Vadeli Hesap</h3>
                <p className="account-number">****5678</p>
                <p className="balance">₺50,000.00</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions">
            <h3>Hızlı İşlemler</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <span className="icon">💸</span>
                Para Transferi
              </button>
              <button className="action-btn">
                <span className="icon">💳</span>
                Fatura Ödeme
              </button>
              <button className="action-btn">
                <span className="icon">📱</span>
                Mobil Ödeme
              </button>
              <button className="action-btn">
                <span className="icon">📊</span>
                Hesap Hareketleri
              </button>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="recent-transactions">
            <h3>Son İşlemler</h3>
            <div className="transaction-list">
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Para Transferi</span>
                  <span className="transaction-date">15.01.2024</span>
                </div>
                <span className="transaction-amount negative">-₺500.00</span>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Maaş Yatırımı</span>
                  <span className="transaction-date">01.01.2024</span>
                </div>
                <span className="transaction-amount positive">+₺8,500.00</span>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Fatura Ödemesi</span>
                  <span className="transaction-date">28.12.2023</span>
                </div>
                <span className="transaction-amount negative">-₺125.75</span>
              </div>
            </div>
          </section>
        </div>
        </main>
      </div>
      
      <footer className="main-footer">
        <p>&copy; 2024 Banka Hesap Yönetimi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default HomePage;