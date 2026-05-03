import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiMapPin } from 'react-icons/fi';
import { createOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCartState } = useCart();
  const { items = [], total = 0 } = cart;
  const tax = total * 0.18;
  const shipping = total > 999 ? 0 : 99;
  const grand = total + tax + shipping;

  const [form, setForm] = useState({ fullName: '', address: '', city: '', state: '', pinCode: '', phone: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' });
  const [loading, setLoading] = useState(false);

  const set = (setter) => (e) => setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      await createOrder({ shippingAddress: form, paymentMethod: 'Card' });
      clearCartState();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  const Field = ({ label, name, value, onChange, placeholder, type = 'text', required = true }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        required={required} className="input-field" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                <FiMapPin className="text-primary-600" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Full Name" name="fullName" value={form.fullName} onChange={set(setForm)} placeholder="John Doe" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address" name="address" value={form.address} onChange={set(setForm)} placeholder="Street, Area, Landmark" />
                </div>
                <Field label="City" name="city" value={form.city} onChange={set(setForm)} placeholder="Mumbai" />
                <Field label="State" name="state" value={form.state} onChange={set(setForm)} placeholder="Maharashtra" />
                <Field label="PIN Code" name="pinCode" value={form.pinCode} onChange={set(setForm)} placeholder="400001" />
                <Field label="Phone" name="phone" value={form.phone} onChange={set(setForm)} placeholder="+91 9999999999" type="tel" />
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <FiCreditCard className="text-primary-600" /> Payment Details
              </h2>
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-4">
                🔒 This is a simulated payment. No real charges will be made.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Name on Card" name="nameOnCard" value={payment.nameOnCard} onChange={set(setPayment)} placeholder="John Doe" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Card Number" name="cardNumber" value={payment.cardNumber} onChange={set(setPayment)} placeholder="4242 4242 4242 4242" />
                </div>
                <Field label="Expiry (MM/YY)" name="expiry" value={payment.expiry} onChange={set(setPayment)} placeholder="12/27" />
                <Field label="CVV" name="cvv" value={payment.cvv} onChange={set(setPayment)} placeholder="123" />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-20 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => item.product && (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.product.image} className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'; }} alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.product.title}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-2xl font-extrabold text-primary-600">{formatPrice(grand)}</span>
              </div>
              <button type="submit" disabled={loading || items.length === 0}
                className="w-full btn-primary py-4 text-lg font-bold">
                {loading ? 'Placing Order...' : '🎉 Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
