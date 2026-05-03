import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { getOrderStats } from '../../services/orderService';
import { formatPrice, formatDate, getStatusClass } from '../../utils/helpers';
import Loader from '../../components/Loader';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    <p className="text-slate-500 text-sm mb-1">{label}</p>
    <p className="text-3xl font-extrabold text-slate-800">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderStats().then((res) => setStats(res.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={formatPrice(stats?.totalRevenue || 0)} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={FiPackage} label="Products" value={stats?.totalProducts || 0} color="text-purple-600" bg="bg-purple-50" />
        <StatCard icon={FiUsers} label="Customers" value={stats?.totalUsers || 0} color="text-orange-600" bg="bg-orange-50" />
      </div>

      {/* Order Status Breakdown */}
      {stats?.byStatus && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <div key={status} className="card p-4 text-center">
              <p className="text-2xl font-bold text-slate-800 mb-1">{stats.byStatus[status] || 0}</p>
              <span className={getStatusClass(status)}>{status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 text-sm">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-600">{order.items.length}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4"><span className={getStatusClass(order.status)}>{order.status}</span></td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <Link to="/admin/products" className="card p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Manage Products</h3>
              <p className="text-slate-500 text-sm">Add, edit, or remove products</p>
            </div>
            <FiArrowRight className="w-6 h-6 text-primary-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        <Link to="/admin/orders" className="card p-6 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Manage Orders</h3>
              <p className="text-slate-500 text-sm">Track and update order statuses</p>
            </div>
            <FiArrowRight className="w-6 h-6 text-primary-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
