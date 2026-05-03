import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Other'];
const SORTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ search, category, sort, page, limit: 12 });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [search, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">All Products</h1>
      <p className="text-slate-500 mb-6">{total} products found</p>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => setParam('search', e.target.value)}
            className="input-field pl-10" />
        </div>
        <select value={sort} onChange={(e) => setParam('sort', e.target.value)}
          className="input-field w-full sm:w-52">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 btn-outline whitespace-nowrap">
          <FiFilter className="w-4 h-4" /> Filters
          {category && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Category</h3>
            {category && <button onClick={() => setParam('category', '')} className="text-red-500 text-sm flex items-center gap-1"><FiX className="w-4 h-4" /> Clear</button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setParam('category', c === category ? '' : c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${category === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(search || category) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {search && (
            <span className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
              Search: "{search}" <button onClick={() => setParam('search', '')}><FiX className="w-4 h-4" /></button>
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
              {category} <button onClick={() => setParam('category', '')}><FiX className="w-4 h-4" /></button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? <Loader /> : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button onClick={() => setParam('page', page - 1)} disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setParam('page', n)}
              className={`w-10 h-10 rounded-xl font-medium transition-all ${page === n ? 'bg-primary-600 text-white' : 'border border-slate-200 hover:bg-slate-50'}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setParam('page', page + 1)} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
        </div>
      )}
    </div>
  );
};

export default Products;
