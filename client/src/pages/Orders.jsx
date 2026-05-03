import { useState, useEffect } from 'react';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getUserOrders } from '../services/orderService';
import { formatPrice, formatDate, getStatusClass } from '../utils/helpers';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getUserOrders().then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center page-enter">
        <FiPackage className="w-20 h-20 text-slate-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-3">No orders yet</h2>
        <p className="text-slate-500">Your order history will appear here.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">My Orders</h1>
      <p className="text-slate-500 mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card overflow-hidden">
            {/* Order Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-slate-500">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                </div>
                <p className="text-sm text-slate-500">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-primary-600">{formatPrice(order.totalAmount)}</span>
                <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  {expanded === order._id ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            </div>

            {/* Order Items (Expandable) */}
            {expanded === order._id && (
              <div className="border-t border-slate-100 p-5 space-y-4 animate-fade-in">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image} alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'; }} />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <p className="text-slate-500 text-sm">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="font-semibold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-4 space-y-1">
                  <div className="text-sm text-slate-600">
                    <strong>Delivery to:</strong> {order.shippingAddress?.fullName}, {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </div>
                  <div className="text-sm text-slate-600">
                    <strong>Payment:</strong> {order.paymentMethod} · <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>{order.paymentStatus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
