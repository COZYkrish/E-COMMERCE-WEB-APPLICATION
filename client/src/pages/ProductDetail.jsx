import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft, FiPackage, FiShield } from 'react-icons/fi';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addItem(product._id, qty);
    setAdding(false);
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft className="w-5 h-5" /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="card overflow-hidden">
          <img src={product.image} alt={product.title}
            className="w-full h-96 lg:h-[500px] object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600'; }} />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">{product.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <FiStar key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="text-slate-600 text-sm">({product.numReviews} reviews)</span>
            </div>
          </div>

          <div className="text-4xl font-extrabold text-slate-800">{formatPrice(product.price)}</div>

          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            <FiPackage className="w-5 h-5 text-slate-500" />
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left!`}
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-slate-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-lg transition-colors">−</button>
                <span className="px-5 py-2 font-semibold text-slate-800 border-x border-slate-200">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-4 py-2 hover:bg-slate-50 text-slate-700 font-bold text-lg transition-colors">+</button>
              </div>
            </div>
          )}

          <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg">
            <FiShoppingCart className="w-6 h-6" />
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <FiShield className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-slate-600 text-sm">Secure checkout · 30-day returns · Authenticity guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
