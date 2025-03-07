import  { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/SideBar';
import Header from '../../components/admin/Header';
import StatCard from '../../components/admin/StatCard';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import { FaDollarSign, FaShoppingBag, FaUsers, FaTruck } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'Admin User' });
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch this data from your API
    // Simulating API call with setTimeout
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          revenue: 52495.90,
          orders: 243,
          customers: 489,
          pendingOrders: 35
        });
        
        setRecentOrders([
          { id: '5928', customer: 'Emma Wilson', date: '2023-04-15', amount: 1250.00, status: 'completed' },
          { id: '5927', customer: 'Michael Johnson', date: '2023-04-14', amount: 890.50, status: 'processing' },
          { id: '5926', customer: 'Sophia Lee', date: '2023-04-14', amount: 2340.00, status: 'shipped' },
          { id: '5925', customer: 'James Brown', date: '2023-04-13', amount: 460.75, status: 'pending' },
          { id: '5924', customer: 'Olivia Davis', date: '2023-04-12', amount: 1890.25, status: 'completed' },
          { id: '5923', customer: 'William Miller', date: '2023-04-11', amount: 720.80, status: 'cancelled' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        <Header user={user} />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back to your admin dashboard</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard 
                  title="Total Revenue" 
                  value={`$${stats.revenue.toLocaleString()}`} 
                  icon={<FaDollarSign className="w-6 h-6 text-gray-500" />}
                  change="12.5%"
                  changeType="increase"
                />
                <StatCard 
                  title="Total Orders" 
                  value={stats.orders} 
                  icon={<FaShoppingBag className="w-6 h-6 text-gray-500" />}
                  change="8.2%"
                  changeType="increase"
                />
                <StatCard 
                  title="Total Customers" 
                  value={stats.customers} 
                  icon={<FaUsers className="w-6 h-6 text-gray-500" />}
                  change="5.3%"
                  changeType="increase"
                />
                <StatCard 
                  title="Pending Orders" 
                  value={stats.pendingOrders} 
                  icon={<FaTruck className="w-6 h-6 text-gray-500" />}
                  change="3.1%"
                  changeType="decrease"
                />
              </div>
              
              <div className="mb-6">
                <RecentOrdersTable orders={recentOrders} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Sales Analytics</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                    {/* integrate a chart library here */}
                    <p className="text-gray-500">Sales Chart Placeholder</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    {/* Sample product items */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Luxury Handbag</h4>
                        <p className="text-xs text-gray-500">124 orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$1,250</p>
                        <p className="text-xs text-green-500">+12%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Designer Watch</h4>
                        <p className="text-xs text-gray-500">98 orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$890</p>
                        <p className="text-xs text-green-500">+8%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Silk Dress</h4>
                        <p className="text-xs text-gray-500">87 orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$760</p>
                        <p className="text-xs text-red-500">-3%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Leather Shoes</h4>
                        <p className="text-xs text-gray-500">65 orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$450</p>
                        <p className="text-xs text-green-500">+5%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded mr-4"></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Gold Necklace</h4>
                        <p className="text-xs text-gray-500">52 orders</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">$975</p>
                        <p className="text-xs text-green-500">+7%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Recent Inventory Updates</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Previous
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Silk Scarf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Leather Wallet
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Designer Sunglasses
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Customer Demographics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">18-24</span>
                        <span className="text-sm text-gray-700">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">25-34</span>
                        <span className="text-sm text-gray-700">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">35-44</span>
                        <span className="text-sm text-gray-700">28%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">45-54</span>
                        <span className="text-sm text-gray-700">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">55+</span>
                        <span className="text-sm text-gray-700">5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-black h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;