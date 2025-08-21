import React from 'react';
import { Link } from 'react-router-dom';
import './Accounts.css';

function Accounts({ currentUser, onLogout }) {
  const accounts = [
    {
      id: 1,
      type: 'Vadesiz Hesap',
      accountNumber: '1234567890',
      balance: 15750.50,
      currency: 'TL',
      iban: 'TR33 0006 1005 1978 6457 8413 26'
    },
    {
      id: 2,
      type: 'Vadeli Hesap',
      accountNumber: '1234567891',
      balance: 25000.00,
      currency: 'TL',
      iban: 'TR33 0006 1005 1978 6457 8413 27',
      maturityDate: '2024-12-31'
    },
    {
      id: 3,
      type: 'Döviz Hesabı',
      accountNumber: '1234567892',
      balance: 2500.75,
      currency: 'USD',
      iban: 'TR33 0006 1005 1978 6457 8413 28'
    },
    {
      id: 4,
      type: 'Altın Hesabı',
      accountNumber: '1234567893',
      balance: 150.25,
      currency: 'gr',
      iban: 'TR33 0006 1005 1978 6457 8413 29'
    }
  ];

  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Maaş Ödemesi', amount: 8500, type: 'credit', accountId: 1 },
    { id: 2, date: '2024-01-14', description: 'Market Alışverişi', amount: -250.75, type: 'debit', accountId: 1 },
    { id: 3, date: '2024-01-13', description: 'Elektrik Faturası', amount: -180.50, type: 'debit', accountId: 1 },
    { id: 4, date: '2024-01-12', description: 'ATM Para Çekme', amount: -500, type: 'debit', accountId: 1 },
    { id: 5, date: '2024-01-11', description: 'Vadeli Hesap Faizi', amount: 125.30, type: 'credit', accountId: 2 }
  ];

  return (
    <div className="accounts-container">
      <header className="main-header">
        <div className="header-content">
          <h1>Hesaplarım</h1>
          <div className="user-info">
            <span>Hoş geldiniz, {currentUser}</span>
            <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
          </div>
        </div>
      </header>
      
      <div className="main-layout">
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/accounts" className="active">Hesaplarım</Link></li>
            <li><Link to="/transfer">Para Transferi</Link></li>
            <li><a href="#cards">Kartlarım</a></li>
            <li><a href="#loans">Krediler</a></li>
          </ul>
        </nav>
        
        <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Hesaplarım</h1>
            <p>Tüm hesaplarınızı ve detaylarını görüntüleyin</p>
          </div>

          {/* Accounts Grid */}
          <div className="accounts-grid">
            {accounts.map(account => (
              <div key={account.id} className="account-detail-card">
                <div className="account-header">
                  <h3>{account.type}</h3>
                  <span className="account-number">{account.accountNumber}</span>
                </div>
                <div className="account-balance">
                  <span className="balance-amount">
                    {account.balance.toLocaleString('tr-TR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} {account.currency}
                  </span>
                </div>
                <div className="account-details">
                  <div className="detail-row">
                    <span className="label">IBAN:</span>
                    <span className="value">{account.iban}</span>
                  </div>
                  {account.maturityDate && (
                    <div className="detail-row">
                      <span className="label">Vade Tarihi:</span>
                      <span className="value">{account.maturityDate}</span>
                    </div>
                  )}
                </div>
                <div className="account-actions">
                  <button className="action-btn primary">Detay Görüntüle</button>
                  <button className="action-btn secondary">Hesap Özeti</button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="recent-transactions-section">
            <h2>Son İşlemler</h2>
            <div className="transactions-table">
              <div className="table-header">
                <div className="header-cell">Tarih</div>
                <div className="header-cell">Açıklama</div>
                <div className="header-cell">Tutar</div>
                <div className="header-cell">Hesap</div>
              </div>
              {transactions.map(transaction => (
                <div key={transaction.id} className="table-row">
                  <div className="table-cell">{transaction.date}</div>
                  <div className="table-cell">{transaction.description}</div>
                  <div className={`table-cell amount ${transaction.type}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('tr-TR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} TL
                  </div>
                  <div className="table-cell">
                    {accounts.find(acc => acc.id === transaction.accountId)?.accountNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </main>
      </div>
      
      <footer className="main-footer">
        <p>&copy; 2024 Banka Hesap Yönetimi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default Accounts;