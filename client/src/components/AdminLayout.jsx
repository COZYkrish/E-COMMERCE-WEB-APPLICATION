import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiHome } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const links = [
    { to: '/admin', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: FiPackage },
    { to: '/', label: 'Back to Shop', icon: FiHome },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <p className="text-white font-bold">ShopZone</p>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${pathname === to ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}>
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-slate-900 z-30 flex gap-1 px-4 py-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all ${pathname === to ? 'bg-primary-600 text-white' : 'text-slate-300 hover:text-white'}`}>
            <Icon className="w-4 h-4" /> {label}
          </Link>
        ))}
      </div>
      {/* Main */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto md:mt-0 mt-20">{children}</main>
    </div>
  );
};

export default AdminLayout;
