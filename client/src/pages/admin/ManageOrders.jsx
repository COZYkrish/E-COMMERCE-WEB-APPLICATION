import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatPrice, formatDate, getStatusClass } from '../../utils/helpers';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = (status = '') => {
    setLoading(true);
    getAllOrders(status ? { status } : {}).then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(filter); }, [filter]);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="page-enter">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
        <p className="text-slate-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${!filter ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'}`}>
          All
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize ${filter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Update Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-500">No orders found</td></tr>
                )}
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-800">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <img src={item.image} className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50'; }} alt="" />
                            <span className="text-xs text-slate-600 truncate max-w-[120px]">{item.title}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && <p className="text-xs text-slate-400">+{order.items.length - 2} more</p>}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-4 text-slate-500 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4"><span className={getStatusClass(order.status)}>{order.status}</span></td>
                    <td className="px-4 py-4">
                      <select value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating === order._id || order.status === 'cancelled' || order.status === 'delivered'}
                        className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 bg-white">
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
