'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addProduct, deleteProduct } from '@/app/actions/products';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
  FolderOpen,
  DollarSign,
  Search,
  Lock,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductWithCategory {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  tag: string | null;
  featured: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AdminClientProps {
  initialProducts: ProductWithCategory[];
  initialCategories: Category[];
}

export default function AdminClient({ initialProducts, initialCategories }: AdminClientProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login credentials states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Products and Search
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // Loading & UI feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.url) {
        setFormImage(data.url);
        showToast('Image uploaded successfully!', 'success');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Sync initialProducts from Server Component
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('syl-admin-session');
    if (session === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      localStorage.setItem('syl-admin-session', 'active');
      document.cookie = 'syl-admin-session=active; path=/; max-age=86400; SameSite=Strict';
      setLoginError('');
      showToast('Logged in successfully', 'success');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('syl-admin-session');
    document.cookie = 'syl-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    showToast('Logged out successfully', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategoryId || !formImage || !formDescription) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await addProduct({
      name: formName,
      price: parseFloat(formPrice),
      image: formImage,
      description: formDescription,
      categoryId: formCategoryId,
      tag: formTag || undefined,
      featured: formFeatured,
    });

    setIsSubmitting(false);

    if (result.success && result.product) {
      showToast('Product added successfully!', 'success');
      // Clear form
      setFormName('');
      setFormPrice('');
      setFormCategoryId('');
      setFormImage('');
      setFormDescription('');
      setFormTag('');
      setFormFeatured(false);
      router.refresh();
    } else {
      showToast(result.error || 'Failed to add product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(id);
    const result = await deleteProduct(id);
    setDeletingId(null);

    if (result.success) {
      showToast('Product deleted successfully!', 'success');
      router.refresh();
    } else {
      showToast(result.error || 'Failed to delete product.', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
    );
  });

  // Calculate stats
  const totalProducts = products.length;
  const totalCategories = initialCategories.length;
  const totalFeatured = products.filter((p) => p.featured).length;

  if (!mounted) return null;

  // ─── LOGIN SCREEN (Premium Glassmorphic) ──────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(234,179,8,0.1)] relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl" />

          {/* Logo header */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
              <Sparkles className="w-7 h-7 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              SYL Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">Authenticate to manage store catalog</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm placeholder-slate-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm placeholder-slate-600 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 focus:outline-none transition-all"
                required
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-sm hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Enter Dashboard</span>
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 text-center relative z-10 border-t border-slate-850 pt-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Default credentials: <span className="text-yellow-500/70">admin / admin123</span></span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD (Premium Dark Glassmorphic) ──────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-16 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]">

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl border shadow-2xl ${
              toast.type === 'success'
                ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900/90 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/10">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-wide block leading-none">SYL SHOPPING CENTER</span>
              <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-widest mt-1 block">Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-yellow-400 transition-colors font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>View Shop</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/30 text-slate-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* ─── STATISTICS PANEL ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Products', value: totalProducts, Icon: ShoppingBag, color: 'text-sky-400', border: 'border-sky-500/20', glow: 'shadow-[0_0_20px_-5px_rgba(56,189,248,0.15)]' },
            { label: 'Categories Loaded', value: totalCategories, Icon: FolderOpen, color: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]' },
            { label: 'Featured Product Rows', value: totalFeatured, Icon: DollarSign, color: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-[0_0_20px_-5px_rgba(52,211,153,0.15)]' },
          ].map((stat) => {
            const Icon = stat.Icon;
            return (
              <div
                key={stat.label}
                className={`bg-slate-900/40 backdrop-blur-md border ${stat.border} rounded-2xl p-6 flex items-center justify-between ${stat.glow} transition-all`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1.5">{stat.label}</span>
                  <span className="text-3xl font-black text-white">{stat.value}</span>
                </div>
                <div className={`p-3.5 rounded-xl bg-slate-950/80 ${stat.color} flex items-center justify-center border border-slate-800`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ─── ADD PRODUCT FORM ─────────────────────────────────────────────── */}
          <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-yellow-500" /> Create Product Listing
              </h2>
              <p className="text-xs text-slate-400 mt-1">Publish new beauty cosmetics or premium groceries</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Matte Lipstick Set"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-yellow-500/50 focus:outline-none transition-all placeholder-slate-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-yellow-500/50 focus:outline-none transition-all placeholder-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-sm focus:border-yellow-500/50 focus:outline-none transition-all"
                    required
                  >
                    <option value="" disabled className="text-slate-800">Select...</option>
                    {initialCategories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-950 text-slate-200">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Product Image *</label>
                <div className="space-y-3">
                  {formImage ? (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-32 flex items-center justify-center">
                      <img src={formImage} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Image</span>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-850 hover:border-yellow-500/30 rounded-xl p-6 bg-slate-950/40 hover:bg-slate-950/80 cursor-pointer transition-all h-32 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-slate-450 font-bold">Uploading file...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <Plus className="w-5 h-5 text-slate-500" />
                          <span className="text-xs text-slate-300 font-bold">Upload Image File</span>
                          <span className="text-[10px] text-slate-500">Drag & drop or click to browse</span>
                        </div>
                      )}
                    </label>
                  )}
                  <input type="hidden" name="image" value={formImage} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Promo Tag</label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. Trending"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-yellow-500/50 focus:outline-none transition-all placeholder-slate-700"
                  />
                </div>
                <div className="flex items-center justify-start h-full pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer rounded bg-slate-950 border-slate-800"
                    />
                    <span className="text-xs font-bold text-slate-450 group-hover:text-slate-200 transition-colors">Featured Item</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the product details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm focus:border-yellow-500/50 focus:outline-none resize-none transition-all placeholder-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Listing</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ─── PRODUCTS TABLE ───────────────────────────────────────────────── */}
          <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Product Catalog</h2>
                <p className="text-xs text-slate-400 mt-0.5">{filteredProducts.length} of {totalProducts} products synced</p>
              </div>

              {/* Table Search */}
              <div className="relative max-w-md w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/85 border border-slate-800 text-slate-200 text-sm focus:border-yellow-500/50 focus:outline-none transition-all placeholder-slate-750"
                />
              </div>
            </div>

            {/* Datatable */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/20">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-widest border-b border-slate-850">
                  <tr>
                    <th className="py-4 px-5">Product</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5 text-right">Price</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-sm font-medium">
                        No products found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border border-slate-800/80 flex-shrink-0"
                            />
                            <div className="max-w-[200px] sm:max-w-xs">
                              <span className="font-bold text-white block truncate">{product.name}</span>
                              <span className="text-xs text-slate-450 line-clamp-1 block mt-0.5">{product.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-300">
                          {product.category.name}
                        </td>
                        <td className="py-4 px-5 text-right font-black text-white">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex flex-wrap gap-1.5">
                            {product.featured && (
                              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Featured
                              </span>
                            )}
                            {product.tag && (
                              <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {product.tag}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deletingId === product.id}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
