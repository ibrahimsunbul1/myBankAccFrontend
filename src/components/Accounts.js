import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accounts.css';

function Accounts({ currentUser, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };
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

  const [userCards, setUserCards] = React.useState([
    {
      id: 1,
      cardNumber: '**** **** **** 1234',
      cardType: 'Kredi Kartı',
      bankName: 'Ziraat Bankası',
      expiryDate: '12/26',
      cardHolder: 'AHMET YILMAZ',
      limit: 15000,
      availableLimit: 12500
    },
    {
      id: 2,
      cardNumber: '**** **** **** 5678',
      cardType: 'Banka Kartı',
      bankName: 'Ziraat Bankası',
      expiryDate: '08/27',
      cardHolder: 'AHMET YILMAZ',
      limit: null,
      availableLimit: null
    }
  ]);

  const [newCard, setNewCard] = React.useState({
    cardNumber: '',
    cardType: 'Kredi Kartı',
    bankName: '',
    expiryDate: '',
    cardHolder: '',
    limit: '',
    availableLimit: ''
  });

  const [showAddCard, setShowAddCard] = React.useState(false);

  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Maaş Ödemesi', amount: 8500, type: 'credit', accountId: 1, category: 'Gelir' },
    { id: 2, date: '2024-01-14', description: 'Market Alışverişi', amount: -250.75, type: 'debit', accountId: 1, category: 'Alışveriş' },
    { id: 3, date: '2024-01-13', description: 'Elektrik Faturası', amount: -180.50, type: 'debit', accountId: 1, category: 'Fatura' },
    { id: 4, date: '2024-01-12', description: 'ATM Para Çekme', amount: -500, type: 'debit', accountId: 1, category: 'Nakit' },
    { id: 5, date: '2024-01-11', description: 'Vadeli Hesap Faizi', amount: 125.30, type: 'credit', accountId: 2, category: 'Faiz' },
    { id: 6, date: '2024-01-10', description: 'Online Alışveriş', amount: -89.99, type: 'debit', accountId: 1, category: 'Alışveriş' },
    { id: 7, date: '2024-01-09', description: 'Restoran Ödemesi', amount: -125.50, type: 'debit', accountId: 1, category: 'Yemek' },
    { id: 8, date: '2024-01-08', description: 'Benzin', amount: -200.00, type: 'debit', accountId: 1, category: 'Ulaşım' }
  ];

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.bankName && newCard.expiryDate && newCard.cardHolder) {
      const cardToAdd = {
        id: userCards.length + 1,
        ...newCard,
        cardNumber: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
        limit: newCard.cardType === 'Kredi Kartı' ? parseFloat(newCard.limit) || 0 : null,
        availableLimit: newCard.cardType === 'Kredi Kartı' ? parseFloat(newCard.availableLimit) || 0 : null
      };
      setUserCards([...userCards, cardToAdd]);
      setNewCard({
        cardNumber: '',
        cardType: 'Kredi Kartı',
        bankName: '',
        expiryDate: '',
        cardHolder: '',
        limit: '',
        availableLimit: ''
      });
      setShowAddCard(false);
    }
  };

  const handleDeleteCard = (cardId) => {
    setUserCards(userCards.filter(card => card.id !== cardId));
  };

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
        {/* Dropdown Menu */}
        <div className="dropdown-menu-container">
          <button 
            className="dropdown-toggle-btn" 
            onClick={toggleSidebar}
            aria-label="Menüyü aç/kapat"
          >
            <div className="toggle-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </button>
          
          {isSidebarOpen && (
            <>
              <div className="dropdown-menu">
                <ul className="dropdown-menu-list">
                  <li>
                    <button className="dropdown-link" onClick={() => handleNavigation('/')}>
                      <span className="nav-icon">🏠</span>
                      Ana Sayfa
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-link active">
                      <span className="nav-icon">💳</span>
                      Hesaplarım
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-link" onClick={() => handleNavigation('/transfer')}>
                      <span className="nav-icon">💸</span>
                      Para Transferi
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-link" onClick={() => handleNavigation('/payments')}>
                      <span className="nav-icon">💰</span>
                      Ödemeler
                    </button>
                  </li>
                </ul>
              </div>
              <div className="dropdown-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            </>
          )}
        </div>
        
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

          {/* User Cards Section */}
          <div className="cards-section">
            <div className="section-header">
              <h2>Kartlarım</h2>
              <button 
                className="add-card-btn"
                onClick={() => setShowAddCard(!showAddCard)}
              >
                {showAddCard ? 'İptal' : 'Yeni Kart Ekle'}
              </button>
            </div>

            {showAddCard && (
              <div className="add-card-form">
                <h3>Yeni Kart Ekle</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Kart Numarası (Son 4 Hane)</label>
                    <input
                      type="text"
                      maxLength="4"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                      placeholder="1234"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kart Türü</label>
                    <select
                      value={newCard.cardType}
                      onChange={(e) => setNewCard({...newCard, cardType: e.target.value})}
                    >
                      <option value="Kredi Kartı">Kredi Kartı</option>
                      <option value="Banka Kartı">Banka Kartı</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Banka Adı</label>
                    <input
                      type="text"
                      value={newCard.bankName}
                      onChange={(e) => setNewCard({...newCard, bankName: e.target.value})}
                      placeholder="Ziraat Bankası"
                    />
                  </div>
                  <div className="form-group">
                    <label>Son Kullanma Tarihi</label>
                    <input
                      type="text"
                      value={newCard.expiryDate}
                      onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kart Sahibi</label>
                    <input
                      type="text"
                      value={newCard.cardHolder}
                      onChange={(e) => setNewCard({...newCard, cardHolder: e.target.value})}
                      placeholder="AHMET YILMAZ"
                    />
                  </div>
                  {newCard.cardType === 'Kredi Kartı' && (
                    <>
                      <div className="form-group">
                        <label>Kart Limiti</label>
                        <input
                          type="number"
                          value={newCard.limit}
                          onChange={(e) => setNewCard({...newCard, limit: e.target.value})}
                          placeholder="15000"
                        />
                      </div>
                      <div className="form-group">
                        <label>Kullanılabilir Limit</label>
                        <input
                          type="number"
                          value={newCard.availableLimit}
                          onChange={(e) => setNewCard({...newCard, availableLimit: e.target.value})}
                          placeholder="12500"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={handleAddCard}>Kaydet</button>
                  <button className="cancel-btn" onClick={() => setShowAddCard(false)}>İptal</button>
                </div>
              </div>
            )}

            <div className="cards-grid">
              {userCards.map(card => (
                <div key={card.id} className="card-item">
                  <div className="card-visual">
                    <div className="card-number">{card.cardNumber}</div>
                    <div className="card-info">
                      <div className="card-holder">{card.cardHolder}</div>
                      <div className="card-expiry">{card.expiryDate}</div>
                    </div>
                  </div>
                  <div className="card-details">
                    <h4>{card.cardType}</h4>
                    <p>{card.bankName}</p>
                    {card.limit && (
                      <div className="card-limits">
                        <div className="limit-info">
                          <span>Limit: {card.limit.toLocaleString('tr-TR')} TL</span>
                          <span>Kullanılabilir: {card.availableLimit.toLocaleString('tr-TR')} TL</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    className="delete-card-btn"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Movements */}
          <div className="account-movements-section">
            <h2>Hesap Hareketleri</h2>
            <div className="movements-filters">
              <div className="filter-group">
                <label>Hesap Seçin:</label>
                <select>
                  <option value="all">Tüm Hesaplar</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.type} - {account.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Kategori:</label>
                <select>
                  <option value="all">Tüm Kategoriler</option>
                  <option value="Gelir">Gelir</option>
                  <option value="Alışveriş">Alışveriş</option>
                  <option value="Fatura">Fatura</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Faiz">Faiz</option>
                  <option value="Yemek">Yemek</option>
                  <option value="Ulaşım">Ulaşım</option>
                </select>
              </div>
            </div>
            <div className="transactions-table">
              <div className="table-header">
                <div className="header-cell">Tarih</div>
                <div className="header-cell">Açıklama</div>
                <div className="header-cell">Kategori</div>
                <div className="header-cell">Tutar</div>
                <div className="header-cell">Hesap</div>
              </div>
              {transactions.map(transaction => (
                <div key={transaction.id} className="table-row">
                  <div className="table-cell">{transaction.date}</div>
                  <div className="table-cell">{transaction.description}</div>
                  <div className="table-cell">
                    <span className={`category-tag ${transaction.category.toLowerCase()}`}>
                      {transaction.category}
                    </span>
                  </div>
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