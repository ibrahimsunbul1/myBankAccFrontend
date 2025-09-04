import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoneyTransfer.css';
import { useUser } from '../context/UserContext';
import { transferAPI } from '../services/api';

function MoneyTransfer({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const { user, accounts, updateBalance } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    recipientName: '',
    amount: '',
    description: '',
    transferType: 'eft'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);


  // Placeholder hesaplar (API yoksa kullanılacak)
  const defaultUserAccounts = [
    { id: '1234567890', name: 'Vadesiz Hesap', balance: 15750.50, accountType: 'SAVINGS' },
    { id: '1234567891', name: 'Vadeli Hesap', balance: 25000.00, accountType: 'FIXED_DEPOSIT' },
    { id: '1234567892', name: 'Döviz Hesabı (USD)', balance: 2500.75, accountType: 'FOREIGN_CURRENCY' }
  ];

  // Context'ten gelen hesapları kullan, yoksa placeholder'ları kullan
  const userAccounts = accounts && accounts.length > 0 ? accounts : defaultUserAccounts;

  useEffect(() => {
    // Component mounted - user authentication is handled by context
  }, [user]);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!transferData.fromAccount) {
      newErrors.fromAccount = 'Gönderen hesap seçiniz';
    }

    if (!transferData.toAccount) {
      newErrors.toAccount = 'Alıcı hesap numarası giriniz';
    } else if (transferData.toAccount.length < 10) {
      newErrors.toAccount = 'Geçerli bir hesap numarası giriniz';
    }

    if (!transferData.recipientName) {
      newErrors.recipientName = 'Alıcı adı giriniz';
    }

    if (!transferData.amount) {
      newErrors.amount = 'Transfer tutarı giriniz';
    } else if (parseFloat(transferData.amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz';
    } else {
      const selectedAccount = userAccounts.find(acc => acc.id === transferData.fromAccount);
      if (selectedAccount && parseFloat(transferData.amount) > selectedAccount.balance) {
        newErrors.amount = 'Yetersiz bakiye';
      }
    }

    if (!transferData.description) {
      newErrors.description = 'Açıklama giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const transferPayload = {
        fromAccountId: transferData.fromAccount,
        toAccountNumber: transferData.toAccount,
        recipientName: transferData.recipientName,
        amount: parseFloat(transferData.amount),
        description: transferData.description,
        transferType: transferData.transferType,
        fee: getTransferFee()
      };
      
      const response = await transferAPI.createTransfer(transferPayload);
      
      if (response && response.success) {
        setTransferSuccess(true);
        
        // Bakiyeyi güncelle
        if (response.newBalance !== undefined) {
          updateBalance(response.newBalance);
        }
        
        // Transfer completed successfully
        
        // Reset form after success
        setTimeout(() => {
          setTransferSuccess(false);
          setTransferData({
            fromAccount: '',
            toAccount: '',
            recipientName: '',
            amount: '',
            description: '',
            transferType: 'eft'
          });
        }, 3000);
      } else {
        const errorMessage = response?.message || 'Transfer işlemi başarısız oldu.';
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Transfer error:', error);
      const errorMessage = error.message || 'Transfer işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getTransferFee = () => {
    switch (transferData.transferType) {
      case 'havale':
        return 0;
      case 'eft':
        return 2.50;
      case 'swift':
        return 25.00;
      default:
        return 0;
    }
  };

  return (
    <div className="transfer-container">
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
          <>
            <div className="dropdown-menu">
              <ul className="dropdown-menu-list">
                <li>
                  <button onClick={() => handleNavigation('/')} className="dropdown-link">
                    <span className="nav-icon">🏠</span>
                    Ana Sayfa
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation('/payments')} className="dropdown-link">
                    <span className="nav-icon">💳</span>
                    Ödemeler
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation('/transfer')} className="dropdown-link active">
                    <span className="nav-icon">💸</span>
                    Para Transferi
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation('/accounts')} className="dropdown-link">
                    <span className="nav-icon">🏦</span>
                    Hesaplarım
                  </button>
                </li>
              </ul>
            </div>
            <div className="dropdown-overlay" onClick={() => setIsSidebarOpen(false)}></div>
          </>
        )}
      </div>

      <header className="main-header">
        <div className="header-content">
          <h1>Para Transferi</h1>
          <div className="user-info">
            <span>Hoş geldiniz, {currentUser}</span>
            <button className="logout-btn" onClick={onLogout}>Çıkış Yap</button>
          </div>
        </div>
      </header>
      
      <div className="main-layout">
        <main className="main-content">
          <div className="page-header">
            <h2>Güvenli ve Hızlı Para Transferi</h2>
          </div>
            {transferSuccess ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h2>Transfer Başarılı!</h2>
                <p>Para transferiniz başarıyla gerçekleştirildi.</p>
                <div className="transfer-details">
                  <p><strong>Tutar:</strong> {parseFloat(transferData.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</p>
                  <p><strong>Alıcı:</strong> {transferData.recipientName}</p>
                  <p><strong>Hesap:</strong> {transferData.toAccount}</p>
                </div>
              </div>
            ) : (
              <div className="transfer-form-container">
                <div className="transfer-types">
                  <h3>Transfer Türü Seçin</h3>
                  <div className="type-buttons">
                    <button 
                      className={`type-btn ${transferData.transferType === 'havale' ? 'active' : ''}`}
                      onClick={() => setTransferData(prev => ({ ...prev, transferType: 'havale' }))}
                    >
                      <div className="type-info">
                        <h4>Havale</h4>
                        <p>Aynı banka içi - Ücretsiz</p>
                      </div>
                    </button>
                    <button 
                      className={`type-btn ${transferData.transferType === 'eft' ? 'active' : ''}`}
                      onClick={() => setTransferData(prev => ({ ...prev, transferType: 'eft' }))}
                    >
                      <div className="type-info">
                        <h4>EFT</h4>
                        <p>Diğer bankalar - 2.50 TL</p>
                      </div>
                    </button>
                    <button 
                      className={`type-btn ${transferData.transferType === 'swift' ? 'active' : ''}`}
                      onClick={() => setTransferData(prev => ({ ...prev, transferType: 'swift' }))}
                    >
                      <div className="type-info">
                        <h4>SWIFT</h4>
                        <p>Uluslararası - 25.00 TL</p>
                      </div>
                    </button>
                  </div>
                </div>

                <form className="transfer-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fromAccount">Gönderen Hesap</label>
                      <select
                        id="fromAccount"
                        name="fromAccount"
                        value={transferData.fromAccount}
                        onChange={handleInputChange}
                        className={errors.fromAccount ? 'error' : ''}
                      >
                        <option value="">Hesap seçiniz</option>
                        {userAccounts.map(account => (
                          <option key={account.id} value={account.id}>
                            {account.name} - {account.id} (Bakiye: {account.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL)
                          </option>
                        ))}
                      </select>
                      {errors.fromAccount && <span className="error-text">{errors.fromAccount}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="toAccount">Alıcı Hesap Numarası / IBAN</label>
                      <input
                        type="text"
                        id="toAccount"
                        name="toAccount"
                        value={transferData.toAccount}
                        onChange={handleInputChange}
                        placeholder="TR33 0006 1005 1978 6457 8413 26"
                        className={errors.toAccount ? 'error' : ''}
                      />
                      {errors.toAccount && <span className="error-text">{errors.toAccount}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="recipientName">Alıcı Adı Soyadı</label>
                      <input
                        type="text"
                        id="recipientName"
                        name="recipientName"
                        value={transferData.recipientName}
                        onChange={handleInputChange}
                        placeholder="Alıcının tam adını giriniz"
                        className={errors.recipientName ? 'error' : ''}
                      />
                      {errors.recipientName && <span className="error-text">{errors.recipientName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="amount">Transfer Tutarı (TL)</label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={transferData.amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={errors.amount ? 'error' : ''}
                      />
                      {errors.amount && <span className="error-text">{errors.amount}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="description">Açıklama</label>
                      <textarea
                        id="description"
                        name="description"
                        value={transferData.description}
                        onChange={handleInputChange}
                        placeholder="Transfer açıklaması giriniz"
                        rows="3"
                        className={errors.description ? 'error' : ''}
                      ></textarea>
                      {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>
                  </div>

                  {transferData.amount && (
                    <div className="transfer-summary">
                      <h4>Transfer Özeti</h4>
                      <div className="summary-row">
                        <span>Transfer Tutarı:</span>
                        <span>{parseFloat(transferData.amount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                      </div>
                      <div className="summary-row">
                        <span>İşlem Ücreti:</span>
                        <span>{getTransferFee().toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                      </div>
                      <div className="summary-row total">
                        <span>Toplam Tutar:</span>
                        <span>{(parseFloat(transferData.amount || 0) + getTransferFee()).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="transfer-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Transfer Yapılıyor...' : 'Transfer Yap'}
                  </button>
                </form>
              </div>
              )}
        </main>
      </div>
      
      <footer className="main-footer">
        <p>&copy; 2024 Banka Hesap Yönetimi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default MoneyTransfer;