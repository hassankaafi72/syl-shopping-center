'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import Navbar from '@/components/Navbar';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  Sparkles,
  MessageSquare,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const SORT_LABELS: Record<SortOption, string> = {
  default: 'Featured',
  'price-asc': 'Price: Low → High',
  'price-desc': 'Price: High → Low',
  'name-asc': 'Name: A → Z',
};

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

interface ProductsClientProps {
  initialProducts: ProductWithCategory[];
  initialCategories: Category[];
}

export default function ProductsClient({ initialProducts, initialCategories }: ProductsClientProps) {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Checkout state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});

  const cartItems = useCart((s) => s.items);
  const addItem = useCart((s) => s.addItem);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const getCartTotal = useCart((s) => s.getCartTotal);
  const clearCart = useCart((s) => s.clearCart);

  const SELLER_WHATSAPP = '25261000000';

  useEffect(() => { setMounted(true); }, []);

  // Categories list starting with 'All'
  const categoriesList = useMemo(() => {
    return ['All', ...initialCategories.map((c) => c.name)];
  }, [initialCategories]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category?.name === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category?.name || '').toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'name-asc': return list.sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.name = 'Name is required';
    if (!customerPhone.trim()) errors.phone = 'Phone number is required';
    if (!customerAddress.trim()) errors.address = 'Delivery address is required';

    if (Object.keys(errors).length > 0) { setCheckoutErrors(errors); return; }
    setCheckoutErrors({});

    let message = `🛍️ *SYL SHOPPING CENTER - NEW ORDER*\n=========================\n\n`;
    cartItems.forEach((item, i) => {
      message += `${i + 1}. *${item.name}*\n   Qty: ${item.quantity} × $${item.price.toFixed(2)}\n   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    const total = getCartTotal();
    message += `=========================\n💰 *Total: $${total.toFixed(2)}*\n\n`;
    message += `👤 *Customer:*\n• Name: ${customerName}\n• Phone: ${customerPhone}\n• Address: ${customerAddress}\n`;
    if (orderNotes.trim()) message += `• Notes: ${orderNotes}\n`;
    message += `\n⚡ Please process my order. Thank you!`;

    window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    setCustomerName(''); setCustomerPhone(''); setCustomerAddress(''); setOrderNotes('');
    setCartOpen(false);
  };

  const cartCount = mounted ? cartItems.reduce((a, c) => a + c.quantity, 0) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      {/* Ambient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* ─── PAGE HEADER ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">The Full Collection</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">All Products</h1>
              <p className="text-slate-400 mt-2 font-light">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {selectedCategory !== 'All' && <span> in <span className="text-yellow-400">{selectedCategory}</span></span>}
                {searchQuery.trim() && <span> for "<span className="text-yellow-400">{searchQuery}</span>"</span>}
              </p>
            </div>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">← Back to Home</Link>
          </div>
        </motion.div>
      </section>

      {/* ─── FILTER & SEARCH BAR ──────────────────────────────────────────────── */}
      <div className="sticky top-[80px] z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 focus:border-yellow-500/40 focus:outline-none text-slate-200 text-sm placeholder:text-slate-600 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 flex-wrap">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-yellow-500/10'
                      : 'bg-slate-900/70 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'Cosmetics & Beauty' && <Sparkles className="w-3 h-3" />}
                  {cat === 'Groceries & Food' && <span>🥗</span>}
                  {cat === 'All' && <SlidersHorizontal className="w-3 h-3" />}
                  {cat === 'All' ? 'All' : cat === 'Cosmetics & Beauty' ? 'Cosmetics' : cat === 'Groceries & Food' ? 'Groceries' : cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all whitespace-nowrap"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {SORT_LABELS[sortBy]}
              </button>
              <AnimatePresence>
                {sortMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortBy(key); setSortMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === key ? 'bg-yellow-500/10 text-yellow-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {SORT_LABELS[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRODUCTS GRID ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-5">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, i) => {
                const isInCart = mounted && cartItems.some((item) => item.id === product.id);
                const cartQty = mounted ? cartItems.find((item) => item.id === product.id)?.quantity || 0 : 0;
                const categoryName = product.category?.name || 'General';

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                    className="group bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-yellow-500/25 p-4 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-yellow-500/5"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-slate-950/80 text-yellow-400 border border-yellow-500/20 backdrop-blur-md">
                        {categoryName === 'Cosmetics & Beauty' ? 'Cosmetics' : 'Groceries'}
                      </span>
                      {product.tag && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 px-1">
                      <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-yellow-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{product.description}</p>
                    </div>

                    {/* CTA */}
                    <div className="pt-3.5 border-t border-slate-900 flex items-center justify-between mt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Price</span>
                        <span className="text-lg font-extrabold text-white">${product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: categoryName, description: product.description })}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                          isInCart
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:shadow-md hover:shadow-yellow-500/15'
                        }`}
                      >
                        {isInCart ? (
                          <><Check className="w-3.5 h-3.5" /><span>Added ({cartQty})</span></>
                        ) : (
                          <><ShoppingBag className="w-3.5 h-3.5" /><span>Add</span></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── CART DRAWER ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-900 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-900 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold">{cartCount}</span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pr-4 space-y-4 scrollbar-thin">
                {!mounted || cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-7 h-7 text-slate-600" />
                    </div>
                    <p className="text-slate-400 font-light">Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <span className="text-xs text-slate-500 block mb-1.5">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold text-slate-200 w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between h-14">
                        <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors self-end"><Trash2 className="w-3.5 h-3.5" /></button>
                        <span className="font-bold text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {mounted && cartItems.length > 0 && (
                <div className="flex-shrink-0 border-t border-slate-900 max-h-[58vh] overflow-y-auto scrollbar-thin">
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400 text-sm"><span>Subtotal</span><span>${getCartTotal().toFixed(2)}</span></div>
                      <div className="flex justify-between text-slate-400 text-sm"><span>Shipping</span><span className="text-emerald-400">Complimentary</span></div>
                      <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-900"><span>Total</span><span className="text-yellow-400">${getCartTotal().toFixed(2)}</span></div>
                    </div>
                    <form onSubmit={handleCheckout} className="space-y-3">
                      {[
                        { label: 'Full Name', type: 'text', value: customerName, setter: setCustomerName, placeholder: 'Fadumo Ali', error: checkoutErrors.name },
                        { label: 'Phone Number', type: 'tel', value: customerPhone, setter: setCustomerPhone, placeholder: '+252 61 000 0000', error: checkoutErrors.phone },
                      ].map(({ label, type, value, setter, placeholder, error }) => (
                        <div key={label}>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
                          <input type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-slate-800 focus:border-yellow-500/40'} text-slate-200 text-sm focus:outline-none transition-all`} />
                          {error && <span className="text-[10px] text-red-400 mt-1 block">{error}</span>}
                        </div>
                      ))}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Delivery Address</label>
                        <textarea rows={2} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="District, Street, Mogadishu" className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${checkoutErrors.address ? 'border-red-500/50' : 'border-slate-800 focus:border-yellow-500/40'} text-slate-200 text-sm focus:outline-none resize-none transition-all`} />
                        {checkoutErrors.address && <span className="text-[10px] text-red-400 mt-1 block">{checkoutErrors.address}</span>}
                      </div>
                      <input type="text" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Order notes (optional)" className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-yellow-500/40 text-slate-200 text-sm focus:outline-none transition-all" />
                      <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
                        <MessageSquare className="w-4 h-4" /><span>Order via WhatsApp</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
