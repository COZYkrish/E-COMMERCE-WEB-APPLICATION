import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, truncate } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <Link to={`/products/${product._id}`} className="block overflow-hidden">
        <div className="relative overflow-hidden bg-slate-50 h-56">
          <img src={product.image} alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'; }} />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-sm">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-slate-800 hover:text-primary-600 transition-colors line-clamp-2 mb-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm mb-3">{truncate(product.description, 65)}</p>
        <div className="flex items-center gap-1 mb-3">
          <FiStar className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-slate-700">{product.rating?.toFixed(1)}</span>
          <span className="text-sm text-slate-400">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-800">{formatPrice(product.price)}</span>
          <button
            onClick={() => addItem(product._id)}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-xl font-medium transition-all active:scale-95">
            <FiShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
