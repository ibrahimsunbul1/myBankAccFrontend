import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Payments.css';

function Payments({ currentUser, onLogout }) {
  const [selectedPaymentType, setSelectedPaymentType] = useState('bill');
  const [paymentForm, setPaymentForm] = useState({
    billType: 'elektrik',
    subscriberNumber: '',
    amount: '',
    description: ''
  });

  const [recentPayments] = useState([
    { id: 1, date: '2024-01-15', type: 'Elektrik Faturası', amount: 180.50, status: 'Tamamlandı' },
    { id: 2, date: '2024-01-10', type: 'Su Faturası', amount: 95.75, status: 'Tamamlandı' },
    { id: 3, date: '2024-01-08', type: 'Doğalgaz Faturası', amount: 220.30, status: 'Tamamlandı' },
    { id: 4, date: '2024-01-05', type: 'Telefon Faturası', amount: 89.99, status: 'Tamamlandı' },
    { id: 5, date: '2024-01-03', type: 'İnternet Faturası', amount: 79.90, status: 'Tamamlandı' }
  ]);

  const [quickPayments] = useState([
    { id: 1, name: 'Elektrik (TEDAŞ)', icon: '⚡', lastAmount: 180.50 },
    { id: 2, name: 'Su (İSKİ)', icon: '💧', lastAmount: 95.75 },
    { id: 3, name: 'Doğalgaz (İGDAŞ)', icon: '🔥', lastAmount: 220.30 },
    { id: 4, name: 'Telefon (Turkcell)', icon: '📱', lastAmount: 89.99 }
  ]);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Ödeme işlemi simülasyonu
    alert('Ödeme işlemi başarıyla tamamlandı!');
    setPaymentForm({
      billType: 'elektrik',
      subscriberNumber: '',
      amount: '',
      description: ''
    });
  };

  const handleQuickPayment = (payment) => {
    setPaymentForm({
      billType: payment.name.toLowerCase().includes('elektrik') ? 'elektrik' :
                payment.name.toLowerCase().includes('su') ? 'su' :
                payment.name.toLowerCase().includes('doğalgaz') ? 'dogalgaz' : 'telefon',
      subscriberNumber: '',
      amount: payment.lastAmount.toString(),
      description: `${payment.name} fatura ödemesi`
    });
    setSelectedPaymentType('bill');
  };

  return (
    <div className="payments-container">
      <header className="main-header">
        <div className="header-content">
          <h1>Ödemeler</h1>
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
            <li><Link to="/accounts">Hesaplarım</Link></li>
            <li><Link to="/transfer">Para Transferi</Link></li>
            <li><a href="#payments" className="active">Ödemeler</a></li>
          </ul>
        </nav>
        
        <main className="main-content">
          <div className="container">
            <div className="page-header">
              <h1>Ödemeler</h1>
              <p>Fatura ödemelerinizi güvenle gerçekleştirin</p>
            </div>

            {/* Quick Payments */}
            <div className="quick-payments-section">
              <h2>Hızlı Ödemeler</h2>
              <div className="quick-payments-grid">
                {quickPayments.map(payment => (
                  <div key={payment.id} className="quick-payment-card" onClick={() => handleQuickPayment(payment)}>
                    <div className="payment-icon">{payment.icon}</div>
                    <h4>{payment.name}</h4>
                    <p>Son ödeme: {payment.lastAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</p>
                    <button className="quick-pay-btn">Hızlı Öde</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Types */}
            <div className="payment-types-section">
              <h2>Ödeme Türü Seçin</h2>
              <div className="payment-type-tabs">
                <button 
                  className={`tab-btn ${selectedPaymentType === 'bill' ? 'active' : ''}`}
                  onClick={() => setSelectedPaymentType('bill')}
                >
                  Fatura Ödemesi
                </button>
                <button 
                  className={`tab-btn ${selectedPaymentType === 'tax' ? 'active' : ''}`}
                  onClick={() => setSelectedPaymentType('tax')}
                >
                  Vergi Ödemesi
                </button>
                <button 
                  className={`tab-btn ${selectedPaymentType === 'traffic' ? 'active' : ''}`}
                  onClick={() => setSelectedPaymentType('traffic')}
                >
                  Trafik Cezası
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="payment-form-section">
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <h3>
                  {selectedPaymentType === 'bill' && 'Fatura Ödemesi'}
                  {selectedPaymentType === 'tax' && 'Vergi Ödemesi'}
                  {selectedPaymentType === 'traffic' && 'Trafik Cezası Ödemesi'}
                </h3>
                
                <div className="form-grid">
                  {selectedPaymentType === 'bill' && (
                    <>
                      <div className="form-group">
                        <label>Fatura Türü</label>
                        <select 
                          value={paymentForm.billType}
                          onChange={(e) => setPaymentForm({...paymentForm, billType: e.target.value})}
                        >
                          <option value="elektrik">Elektrik</option>
                          <option value="su">Su</option>
                          <option value="dogalgaz">Doğalgaz</option>
                          <option value="telefon">Telefon</option>
                          <option value="internet">İnternet</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Abone Numarası</label>
                        <input
                          type="text"
                          value={paymentForm.subscriberNumber}
                          onChange={(e) => setPaymentForm({...paymentForm, subscriberNumber: e.target.value})}
                          placeholder="Abone numaranızı girin"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedPaymentType === 'tax' && (
                    <>
                      <div className="form-group">
                        <label>Vergi Türü</label>
                        <select>
                          <option value="gelir">Gelir Vergisi</option>
                          <option value="kurumlar">Kurumlar Vergisi</option>
                          <option value="kdv">KDV</option>
                          <option value="mtv">MTV</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Vergi Numarası</label>
                        <input
                          type="text"
                          placeholder="Vergi numaranızı girin"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedPaymentType === 'traffic' && (
                    <>
                      <div className="form-group">
                        <label>Plaka Numarası</label>
                        <input
                          type="text"
                          placeholder="34 ABC 123"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Ceza Numarası</label>
                        <input
                          type="text"
                          placeholder="Ceza numarasını girin"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label>Tutar (TL)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Açıklama (Opsiyonel)</label>
                    <input
                      type="text"
                      value={paymentForm.description}
                      onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                      placeholder="Ödeme açıklaması"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="pay-btn">Ödemeyi Tamamla</button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setPaymentForm({
                      billType: 'elektrik',
                      subscriberNumber: '',
                      amount: '',
                      description: ''
                    });
                  }}>Temizle</button>
                </div>
              </form>
            </div>

            {/* Recent Payments */}
            <div className="recent-payments-section">
              <h2>Son Ödemeler</h2>
              <div className="payments-table">
                <div className="table-header">
                  <div className="header-cell">Tarih</div>
                  <div className="header-cell">Ödeme Türü</div>
                  <div className="header-cell">Tutar</div>
                  <div className="header-cell">Durum</div>
                </div>
                {recentPayments.map(payment => (
                  <div key={payment.id} className="table-row">
                    <div className="table-cell">{payment.date}</div>
                    <div className="table-cell">{payment.type}</div>
                    <div className="table-cell amount">
                      {payment.amount.toLocaleString('tr-TR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })} TL
                    </div>
                    <div className="table-cell">
                      <span className="status-badge completed">{payment.status}</span>
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

export default Payments;