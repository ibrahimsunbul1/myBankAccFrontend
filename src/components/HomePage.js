import React from 'react';
import './HomePage.css';

function HomePage({ currentUser, onLogout }) {
  return (
    <div className="App">
      {/* Header */}
      <header className="bank-header">
        <div className="header-container">
          <div className="logo">
            <h1>MyBank</h1>
          </div>
          <nav className="main-nav">
            <ul>
              <li><a href="#home">Ana Sayfa</a></li>
              <li><a href="#accounts">Hesaplarım</a></li>
              <li><a href="#transfer">Para Transferi</a></li>
              <li><a href="#payments">Ödemeler</a></li>
              <li><a href="#support">Destek</a></li>
            </ul>
          </nav>
          <div className="user-info">
            <span>Hoş geldiniz, {currentUser}</span>
            <button className="logout-btn" onClick={onLogout}>Çıkış</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

      {/* Footer */}
      <footer className="bank-footer">
        <div className="container">
          <p>&copy; 2024 MyBank. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;