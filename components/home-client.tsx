'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import Navbar from '@/components/Navbar';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  MessageSquare,
  Star,
  ChevronRight,
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

interface HomeClientProps {
  initialProducts: ProductWithCategory[];
}

export default function HomeClient({ initialProducts }: HomeClientProps) {
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});

  const cartItems = useCart((state) => state.items);
  const addItem = useCart((state) => state.addItem);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const getCartTotal = useCart((state) => state.getCartTotal);
  const clearCart = useCart((state) => state.clearCart);

  const SELLER_WHATSAPP_NUMBER = '25261000000';

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredProducts = initialProducts.filter((p) => p.featured).slice(0, 9);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!customerName.trim()) errors.name = 'Name is required';
    if (!customerPhone.trim()) errors.phone = 'Phone number is required';
    if (!customerAddress.trim()) errors.address = 'Delivery address is required';

    if (Object.keys(errors).length > 0) {
      setCheckoutErrors(errors);
      return;
    }

    setCheckoutErrors({});

    let message = `🛍️ *SYL SHOPPING CENTER - NEW ORDER*\n`;
    message += `=========================\n\n`;

    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Qty: ${item.quantity} × $${item.price.toFixed(2)}\n`;
      message += `   Subtotal: $${itemTotal.toFixed(2)}\n\n`;
    });

    const total = getCartTotal();
    message += `=========================\n`;
    message += `💰 *Total: $${total.toFixed(2)}*\n\n`;
    message += `👤 *Customer:*\n`;
    message += `• Name: ${customerName}\n`;
    message += `• Phone: ${customerPhone}\n`;
    message += `• Address: ${customerAddress}\n`;
    if (orderNotes.trim()) message += `• Notes: ${orderNotes}\n`;
    message += `\n⚡ Please process my order. Thank you!`;

    const whatsappLink = `https://wa.me/${SELLER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    clearCart();
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setOrderNotes('');
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-950/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-36 overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Somalia's Premium Shopping Destination</span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]"
            >
              Elevate Your Lifestyle at{' '}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                SYL Shopping
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-slate-400 mb-10 leading-relaxed font-light max-w-2xl mx-auto"
            >
              Discover an exclusive collection of premium cosmetics, skincare, and quality everyday groceries — curated for the discerning lifestyle.
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/products"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Contact Us</span>
              </Link>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { value: `${initialProducts.length}+`, label: 'Products Available' },
              { value: '2,000+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '24/7', label: 'WhatsApp Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-yellow-400">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-900 bg-slate-950/40 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: Truck, title: 'Rapid Local Delivery', desc: 'Same-day delivery across Buloburde. Track your order via WhatsApp.' },
              { Icon: ShieldCheck, title: 'Authenticity Guaranteed', desc: 'Every product verified for quality. No fakes, no compromises.' },
              { Icon: TrendingUp, title: 'WhatsApp Support 24/7', desc: 'Reach our team directly on WhatsApp for orders, queries and returns.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-900/30 text-yellow-400 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{title}</h3>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────────────────────────── */}
      <section id="products" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Featured Collection</p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Handpicked For You</h2>
            <p className="text-slate-400 font-light mt-2">Our most-loved products, curated for exceptional quality.</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 hover:border-yellow-500/40 px-4 py-2 rounded-xl transition-all duration-200 bg-yellow-500/5 whitespace-nowrap self-start md:self-auto"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, i) => {
            const isInCart = mounted && cartItems.some((item) => item.id === product.id);
            const cartQty = mounted ? cartItems.find((item) => item.id === product.id)?.quantity || 0 : 0;
            const categoryName = product.category?.name || 'General';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 hover:border-yellow-500/20 p-4 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-yellow-500/5"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-slate-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-950/80 text-yellow-400 border border-yellow-500/20 backdrop-blur-md">
                      {categoryName === 'Cosmetics & Beauty' ? 'Cosmetics' : 'Groceries'}
                    </span>
                    {product.tag && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="px-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xs text-slate-500 block uppercase tracking-wider">Price</span>
                    <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: categoryName, description: product.description })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${isInCart
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:shadow-md hover:shadow-yellow-500/15'
                      }`}
                  >
                    {isInCart ? (
                      <><Check className="w-4 h-4" /><span>Added ({cartQty})</span></>
                    ) : (
                      <><ShoppingBag className="w-4 h-4" /><span>Add to Cart</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Browse All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-yellow-500/30 text-slate-200 hover:text-yellow-400 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/5"
          >
            <Star className="w-4 h-4" />
            <span>Browse All {initialProducts.length}+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── TESTIMONIAL / TRUST BANNER ───────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-slate-900/80 via-slate-950 to-slate-900/80 border-y border-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Why Choose SYL?</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">Trusted by thousands in BuloBurde</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              { quote: '"The best quality cosmetics I\'ve ever found locally. Fast delivery too!"', author: 'Fadumo A.', city: 'Buloburde' },
              { quote: '"Finally a store where I can get everything — beauty and groceries in one order."', author: 'Hodan M.', city: 'Buloburde' },
              { quote: '"Ordering on WhatsApp is so easy. The team responds instantly!"', author: 'Amina H.', city: 'Buloburde' },
            ].map((t) => (
              <div key={t.author} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 text-left">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-4">{t.quote}</p>
                <div>
                  <p className="font-bold text-white text-sm">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CART DRAWER ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-950 border-l border-slate-900 z-50 flex flex-col shadow-2xl"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/90 backdrop-blur-md flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  {mounted && cartItems.length > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold">
                      {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                    </span>
                  )}
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-slate-900 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 pr-4 space-y-4 scrollbar-thin">
                {!mounted || cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mb-4 border border-slate-800">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-slate-400 font-light mb-4">Your cart is empty.</p>
                    <Link href="/products" onClick={() => setCartOpen(false)} className="text-xs font-semibold text-yellow-400 hover:underline">
                      Browse products
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <span className="text-xs text-slate-500 block mb-1.5">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold text-slate-200 px-1 w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between h-16">
                        <button onClick={() => removeItem(item.id)} className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors self-end">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Form */}
              {mounted && cartItems.length > 0 && (
                <div className="flex-shrink-0 border-t border-slate-900 bg-slate-950/90 backdrop-blur-md max-h-[58vh] overflow-y-auto scrollbar-thin">
                  <div className="p-6 space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400 text-sm">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-sm">
                        <span>Shipping</span>
                        <span className="text-emerald-400">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-900">
                        <span>Total</span>
                        <span className="text-yellow-400">${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-3">
                      {[
                        { label: 'Full Name', id: 'name', type: 'text', value: customerName, setter: setCustomerName, placeholder: 'Fadumo Ali', error: checkoutErrors.name },
                        { label: 'Phone Number', id: 'phone', type: 'tel', value: customerPhone, setter: setCustomerPhone, placeholder: '+252 61 000 0000', error: checkoutErrors.phone },
                      ].map(({ label, id, type, value, setter, placeholder, error }) => (
                        <div key={id}>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
                          <input
                            type={type}
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            placeholder={placeholder}
                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${error ? 'border-red-500/50' : 'border-slate-800 focus:border-yellow-500/40'} text-slate-200 text-sm focus:outline-none transition-all`}
                          />
                          {error && <span className="text-[10px] text-red-400 mt-1 block">{error}</span>}
                        </div>
                      ))}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Delivery Address</label>
                        <textarea
                          rows={2}
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="District, Street, Buloburde
                        "
                          className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${checkoutErrors.address ? 'border-red-500/50' : 'border-slate-800 focus:border-yellow-500/40'} text-slate-200 text-sm focus:outline-none transition-all resize-none`}
                        />
                        {checkoutErrors.address && <span className="text-[10px] text-red-400 mt-1 block">{checkoutErrors.address}</span>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Order Notes (Optional)</label>
                        <input
                          type="text"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Any special instructions..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 focus:border-yellow-500/40 text-slate-200 text-sm focus:outline-none transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Order via WhatsApp</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer id="contact-section" className="bg-slate-950 border-t border-slate-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-slate-200 text-lg">SYL Shopping Center</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              <Link href="/products" className="hover:text-yellow-400 transition-colors">Products</Link>
              <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-600" suppressHydrationWarning>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> SYL Shopping Center. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
