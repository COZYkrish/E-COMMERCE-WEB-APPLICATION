import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-white">ShopZone</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">Premium products delivered to your doorstep. Quality guaranteed or your money back.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Returns</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} ShopZone. Built with ❤️ using MERN Stack.
      </div>
    </div>
  </footer>
);

export default Footer;
