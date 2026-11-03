import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  X,
  Search,
  RotateCcw,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Product, Order, BulkQuoteRequest } from '../types';
import { CATEGORIES_DATA } from '../data/initialProducts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  quotes: BulkQuoteRequest[];
  onResetDemoData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  quotes,
  onResetDemoData,
}) => {
  if (!isOpen) return null;

  // Passcode authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'quotes'>('overview');

  // Product Add / Edit Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Cement & Construction Materials',
    brand: '',
    price: 500,
    originalPrice: 600,
    stock: 50,
    unit: 'Piece',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    description: '',
    specifications: { 'Application': 'General Construction' },
    features: ['High durability', 'Bangalore stock'],
    rating: 4.8,
    reviewsCount: 10,
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123' || passwordInput === 'jyoti2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Use default: admin123');
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.brand || !editingProduct.price) return;

    if (editingProduct.id) {
      // update
      onUpdateProduct(editingProduct as Product);
    } else {
      // create new
      const newProd: Product = {
        ...(editingProduct as Product),
        id: `prod-custom-${Date.now()}`,
        images: [editingProduct.image || ''],
        specifications: editingProduct.specifications || { 'Application': 'Site Construction' },
        features: editingProduct.features || ['Authentic item'],
        rating: 4.8,
        reviewsCount: 1,
      };
      onAddProduct(newProd);
    }
    setIsEditingProduct(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsEditingProduct(true);
  };

  const startNewProduct = () => {
    setEditingProduct({
      name: '',
      category: 'Cement & Construction Materials',
      brand: 'UltraTech',
      price: 450,
      originalPrice: 500,
      stock: 50,
      unit: 'Piece',
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      description: 'High quality construction and hardware supply.',
      specifications: { 'Origin': 'Bangalore Yard', 'Warranty': '1 Year' },
      features: ['Genuine manufacturer seal', 'Direct site transport'],
      rating: 4.8,
      reviewsCount: 12,
    });
    setIsEditingProduct(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">
                  Jyoti Hardware Admin Management Console
                </h2>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px] font-bold border border-red-800">
                  Staff Only
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Makali Yard, Bangalore • Live inventory and order dispatch system
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={onResetDemoData}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
                title="Restore default test inventory"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Demo Data</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close admin portal"
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 my-auto">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Staff Authentication Required
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your administrative PIN to manage hardware inventory and customer orders.
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode (default: admin123)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-center font-mono font-bold text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white"
                />
                {authError && <p className="text-xs text-red-600 mt-1 font-medium">{authError}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
              >
                Unlock Dashboard
              </button>
            </form>
            <div className="text-[11px] text-stone-400">
              Demo passcode: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-stone-700 font-bold">admin123</code>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 flex-1 space-y-6">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Total Paid Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">Verified online &amp; site orders</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Customer Orders</span>
                  <ShoppingCart className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-1">
                  {totalOrdersCount} Orders
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">Dispatched from Makali Yard</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Catalog SKUs</span>
                  <Package className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-black text-stone-900 mt-1">
                  {products.length} Products
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">Across 8 Categories</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Low Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {lowStockCount} Items
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">&lt;= 5 units in warehouse</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-6 text-xs font-bold uppercase tracking-wider text-stone-500">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-red-600 text-red-600 font-black'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-red-600 text-red-600 font-black'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Product Catalog ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-red-600 text-red-600 font-black'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Customer Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('quotes')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'quotes'
                    ? 'border-red-600 text-red-600 font-black'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Contractor Quotes ({quotes.length})
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                      Recent Orders Dispatch Board
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  <div className="divide-y divide-stone-200 text-xs">
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-stone-900">
                            #{o.id} — {o.customer.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {o.items.length} items • ₹{o.total.toLocaleString('en-IN')} • {o.paymentMethod.toUpperCase()}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[11px] font-bold uppercase bg-stone-200 text-stone-800">
                          {o.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Warning List */}
                {lowStockCount > 0 && (
                  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                    <h3 className="font-bold text-sm text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Low Stock Alert — Reorder from Mill/Distributor</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {products
                        .filter((p) => p.stock <= 5)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-stone-900">{p.name}</div>
                              <div className="text-stone-500 text-[11px]">{p.brand} • ₹{p.price}</div>
                            </div>
                            <span className="font-black text-amber-700 bg-amber-100 px-2 py-1 rounded">
                              {p.stock} left
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRODUCT MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs text-stone-500 font-semibold">
                    Manage prices, inventory stocks, and item specifications in real-time.
                  </div>
                  <button
                    onClick={startNewProduct}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="border border-stone-200 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left divide-y divide-stone-200">
                    <thead className="bg-stone-100 font-bold text-stone-700">
                      <tr>
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Brand</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-center">Stock</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={p.image}
                                alt=""
                                className="w-8 h-8 rounded object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                                <div className="text-[10px] text-stone-400 font-mono">{p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-stone-600">{p.category}</td>
                          <td className="py-2.5 px-3 font-semibold text-stone-800">{p.brand}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                            ₹{p.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.stock <= 5
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEditProduct(p)}
                                className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-semibold">
                  Track and advance order dispatch stages (updates customer timeline in Track Order view).
                </div>

                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                        <div>
                          <div className="font-mono font-black text-sm text-stone-900">
                            #{o.id}
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {o.date} • Customer: <strong>{o.customer.name}</strong> (Ph: {o.customer.phone})
                          </div>
                        </div>

                        {/* Status Updater */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-500 uppercase text-[10px]">
                            Status:
                          </span>
                          <select
                            value={o.orderStatus}
                            onChange={(e) =>
                              onUpdateOrderStatus(o.id, e.target.value as Order['orderStatus'])
                            }
                            className="bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-bold text-xs text-stone-800 focus:outline-none focus:border-red-600"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing / Assembling</option>
                            <option value="Dispatched">Dispatched from Makali Yard</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="font-bold text-stone-700 mb-1">Delivery Address:</div>
                          <div className="text-stone-600">
                            {o.customer.address}, {o.customer.city} - {o.customer.pinCode}
                          </div>
                          {o.customer.gstNumber && (
                            <div className="text-stone-500 font-mono mt-1">
                              GSTIN: {o.customer.gstNumber}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-stone-700 mb-1">
                            Materials ({o.items.length} items):
                          </div>
                          <div className="space-y-0.5 text-stone-600">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>• {item.product.name}</span>
                                <span className="font-bold">
                                  {item.quantity} {item.product.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                            <span>Total Value:</span>
                            <span className="text-red-600">₹{o.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BULK CONTRACTOR QUOTES */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                <div className="text-xs text-stone-500 font-semibold">
                  Commercial inquiries submitted by Bangalore civil contractors and site engineers.
                </div>

                <div className="space-y-3">
                  {quotes.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-500 text-xs">
                      No bulk quotes submitted yet. Use "Get a Bulk Quote" on the storefront to test.
                    </div>
                  ) : (
                    quotes.map((q) => (
                      <div
                        key={q.id}
                        className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-stone-900">
                            #{q.id} — {q.customerName}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold uppercase text-[10px]">
                            {q.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-stone-600">
                          <div>
                            <strong>Phone:</strong> {q.phone}
                          </div>
                          <div>
                            <strong>Material:</strong> {q.productName}
                          </div>
                          <div>
                            <strong>Quantity:</strong> {q.quantity}
                          </div>
                          <div>
                            <strong>Location:</strong> {q.deliveryLocation}
                          </div>
                        </div>
                        {q.notes && (
                          <div className="text-stone-500 italic bg-white p-2 rounded border border-stone-200">
                            "{q.notes}"
                          </div>
                        )}
                        <div className="pt-2 flex justify-end">
                          <a
                            href={`https://wa.me/91${q.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(q.customerName)},%20this%20is%20Jyoti%20Hardware%20with%20your%20quotation%20for%20${encodeURIComponent(q.productName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Reply via WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Add / Edit Modal Drawer */}
        {isEditingProduct && (
          <div
            className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsEditingProduct(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="font-bold text-base text-stone-900">
                  {editingProduct.id ? 'Edit Product SKU' : 'Add New Hardware SKU'}
                </h3>
                <button
                  onClick={() => setIsEditingProduct(false)}
                  className="p-1 rounded hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg font-semibold bg-white"
                    >
                      {CATEGORIES_DATA.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg Bag, Piece, 20L Bucket, 90m Coil"
                    value={editingProduct.unit || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct.image || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2 border rounded-lg text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                  >
                    Save SKU
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
