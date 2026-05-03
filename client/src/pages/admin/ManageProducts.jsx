import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { formatPrice } from '../../utils/helpers';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Other'];

const EMPTY = { title: '', description: '', price: '', category: 'Electronics', image: '', stock: '', rating: 0, numReviews: 0 };

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    getAdminProducts().then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ title: p.title, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock, rating: p.rating, numReviews: p.numReviews });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing, form);
        toast.success('Product updated!');
      } else {
        await createProduct(form);
        toast.success('Product created!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const F = (key) => ({ name: key, value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">{products.length} total products</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <tr>
                  {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className={`hover:bg-slate-50 transition-colors ${!p.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'; }} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 max-w-xs truncate">{p.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{p.description.slice(0, 50)}...</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.isActive ? <><FiCheck className="w-3 h-3" /> Active</> : <><FiX className="w-3 h-3" /> Deleted</>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        {p.isActive && (
                          <button onClick={() => setDeleteId(p._id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add New Product'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input {...F('title')} required placeholder="Product title" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea {...F('description')} required rows={3} placeholder="Product description..." className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
              <input {...F('price')} type="number" min="0" required placeholder="999" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
              <input {...F('stock')} type="number" min="0" required placeholder="50" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select {...F('category')} required className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating (0-5)</label>
              <input {...F('rating')} type="number" min="0" max="5" step="0.1" placeholder="4.5" className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL *</label>
              <input {...F('image')} required placeholder="https://images.unsplash.com/..." className="input-field" />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-xl border"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-slate-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-outline">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger">Yes, Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageProducts;
