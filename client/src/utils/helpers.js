export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

export const getStatusClass = (status) => {
  const map = { pending: 'badge-pending', processing: 'badge-processing', shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled' };
  return map[status] || 'badge-pending';
};

export const truncate = (str, n = 80) => (str.length > n ? str.slice(0, n) + '…' : str);
