import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Loader from '../components/Loader';

const Cart = () => {
  const { cart, cartLoading, updateItem, removeItem } = useCart();
  const { items = [], total = 0 } = cart;
  const tax = total * 0.18;
  const shipping = total > 999 ? 0 : 99;
  const grand = total + tax + shipping;

  if (cartLoading) return <Loader fullScreen />;

  if (items.length === 0)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center page-enter">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
        <p className="text-slate-500 mb-8">Add some products to continue shopping</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <FiShoppingBag /> Browse Products
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/products" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
        <span className="bg-primary-100 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={item._id} className="card p-4 flex gap-4">
                <img src={p.image} alt={p.title}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'; }} />
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${p._id}`}>
                    <h3 className="font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-2">{p.title}</h3>
                  </Link>
                  <p className="text-slate-500 text-sm mb-3">{formatPrice(item.price)} each</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateItem(p._id, item.quantity - 1)} disabled={item.quantity <= 1}
                        className="px-3 py-1.5 hover:bg-slate-50 disabled:opacity-30 text-slate-700 font-bold transition-colors">−</button>
                      <span className="px-4 py-1.5 font-semibold text-slate-800 border-x border-slate-200">{item.quantity}</span>
                      <button onClick={() => updateItem(p._id, item.quantity + 1)} disabled={item.quantity >= p.stock}
                        className="px-3 py-1.5 hover:bg-slate-50 disabled:opacity-30 text-slate-700 font-bold transition-colors">+</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeItem(p._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit space-y-4 sticky top-20">
          <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
          <div className="space-y-3 text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-slate-800">{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span className="font-medium text-slate-800">{formatPrice(tax)}</span></div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-slate-800'}`}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && <p className="text-xs text-green-600">Add {formatPrice(999 - total)} more for free shipping!</p>}
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <span className="font-bold text-slate-800">Total</span>
            <span className="text-2xl font-extrabold text-primary-600">{formatPrice(grand)}</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center block py-4 text-lg font-bold">
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
