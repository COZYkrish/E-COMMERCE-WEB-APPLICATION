import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Electronics', emoji: '⚡', color: 'from-blue-500 to-cyan-400' },
  { name: 'Clothing', emoji: '👗', color: 'from-pink-500 to-rose-400' },
  { name: 'Books', emoji: '📚', color: 'from-amber-500 to-orange-400' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'from-green-500 to-emerald-400' },
  { name: 'Sports', emoji: '🏃', color: 'from-purple-500 to-violet-400' },
  { name: 'Beauty', emoji: '✨', color: 'from-red-500 to-pink-400' },
];

const FEATURES = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
  { icon: FiShield, title: 'Secure Payment', desc: 'Your data is always safe' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8, sort: 'rating' })
      .then((res) => setFeatured(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <span className="inline-block bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
              🛍️ New arrivals every week
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Shop the <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">Future</span>,<br />Today.
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Discover premium products across all categories. Unbeatable prices, lightning-fast delivery, and a shopping experience you'll love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95">
                Shop Now <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                Join Free
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative blob */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 hidden lg:block"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      </section>

      {/* Features */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-sm font-medium text-slate-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Top Rated Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-10 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-3">Get 20% off your first order!</h2>
            <p className="text-primary-100 mb-6">Sign up today and unlock exclusive deals, early access to new products, and free shipping on your first purchase.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-slate-50 px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
              Create Free Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
