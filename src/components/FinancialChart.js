import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getHistoricalData } from '../services/financialService';
import './FinancialChart.css';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function FinancialChart() {
  const [chartData, setChartData] = useState(null);
  const [activeChart, setActiveChart] = useState('usdTry');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const historicalData = await getHistoricalData(30); // Son 30 gün
        
        const labels = historicalData.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
        });
        
        const datasets = {
          usdTry: {
            label: 'USD/TRY',
            data: historicalData.map(item => item.usdTry),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          gold: {
            label: 'Altın (USD/Ons)',
            data: historicalData.map(item => item.gold),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          },
          bist: {
            label: 'BIST 100',
            data: historicalData.map(item => item.bist),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          }
        };
        
        setChartData({ labels, datasets });
      } catch (error) {
        console.error('Grafik verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChartData();
  }, []);

  const getChartConfig = () => {
    if (!chartData) return null;
    
    return {
      labels: chartData.labels,
      datasets: [chartData.datasets[activeChart]]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: getChartTitle(),
        color: '#1f2937',
        font: {
          size: 16,
          weight: '700'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value) {
            if (activeChart === 'usdTry') {
              return '₺' + value.toFixed(2);
            } else if (activeChart === 'gold') {
              return '$' + value.toFixed(0);
            } else {
              return value.toFixed(0);
            }
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  function getChartTitle() {
    switch (activeChart) {
      case 'usdTry':
        return 'USD/TRY Kuru (Son 30 Gün)';
      case 'gold':
        return 'Altın Fiyatı (Son 30 Gün)';
      case 'bist':
        return 'BIST 100 Endeksi (Son 30 Gün)';
      default:
        return 'Finansal Veriler';
    }
  }

  if (loading) {
    return (
      <div className="financial-chart-container">
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Grafik yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-chart-container">
      <div className="chart-header">
        <h3>Finansal Piyasa Grafikleri</h3>
        <div className="chart-tabs">
          <button 
            className={`chart-tab ${activeChart === 'usdTry' ? 'active' : ''}`}
            onClick={() => setActiveChart('usdTry')}
          >
            USD/TRY
          </button>
          <button 
            className={`chart-tab ${activeChart === 'gold' ? 'active' : ''}`}
            onClick={() => setActiveChart('gold')}
          >
            Altın
          </button>
          <button 
            className={`chart-tab ${activeChart === 'bist' ? 'active' : ''}`}
            onClick={() => setActiveChart('bist')}
          >
            BIST 100
          </button>
        </div>
      </div>
      
      <div className="chart-wrapper">
        {chartData && (
          <Line 
            data={getChartConfig()} 
            options={chartOptions}
          />
        )}
      </div>
    </div>
  );
}

export default FinancialChart;