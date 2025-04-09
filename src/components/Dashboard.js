import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const urlsRef = collection(db, 'urls');
        const q = query(urlsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const urlsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUrls(urlsData);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [currentUser]);

  const getClicksData = (url) => {
    const timestamps = url.analytics.timestamps;
    const groupedData = timestamps.reduce((acc, timestamp) => {
      const date = format(new Date(timestamp), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedData).sort();
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Clicks',
          data: sortedDates.map(date => groupedData[date]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const getPieData = (data, label) => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const backgroundColors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ];

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1,
          borderColor: backgroundColors.slice(0, labels.length).map(color => color.replace('0.8', '1'))
        }
      ]
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">URL Analytics Dashboard</h1>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Original URL</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Short URL</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Clicks</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Expiration</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {urls.map((url) => (
              <tr key={url.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{url.originalUrl}</td>
                <td className="px-6 py-4 text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                  <a href={`/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {window.location.origin}/{url.shortCode}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{url.clicks}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {format(new Date(url.createdAt), 'PPP')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {url.expirationDate ? format(new Date(url.expirationDate), 'PPP') : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <QRCode
                      value={`${window.location.origin}/${url.shortCode}`}
                      size={64}
                      level="L"
                      className="h-16 w-16"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {urls.map((url) => (
        <div key={url.id} className="mt-8 bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Analytics for {url.shortCode}</h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Click Trends</h3>
            <div className="h-72">
              <Line 
                data={getClicksData(url)} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        font: {
                          size: 14,
                          weight: '600'
                        }
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      titleColor: '#1f2937',
                      bodyColor: '#4b5563',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      padding: 12,
                      bodyFont: {
                        size: 14
                      },
                      titleFont: {
                        size: 16,
                        weight: 'bold'
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      },
                      ticks: {
                        font: {
                          size: 12
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        font: {
                          size: 12
                        }
                      }
                    }
                  },
                  animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Devices</h3>
              <div className="h-64">
                <Pie 
                  data={getPieData(url.analytics.devices, 'Device Distribution')} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            size: 13,
                            weight: '500'
                          },
                          padding: 20
                        }
                      }
                    },
                    animation: {
                      duration: 1000,
                      animateRotate: true,
                      animateScale: true
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Browsers</h3>
              <div className="h-64">
                <Pie 
                  data={getPieData(url.analytics.browsers, 'Browser Distribution')} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            size: 13,
                            weight: '500'
                          },
                          padding: 20
                        }
                      }
                    },
                    animation: {
                      duration: 1000,
                      animateRotate: true,
                      animateScale: true
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}