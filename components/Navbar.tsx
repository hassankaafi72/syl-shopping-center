'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Sparkles, Menu, X, PhoneCall, Lock } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartClick: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({ onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const cartCount = useCart((state) => state.getCartItemsCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/75 backdrop-blur-xl border-b border-yellow-500/10 shadow-lg shadow-yellow-500/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ─── Logo ──────────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-wider uppercase">
              SYL Shopping
            </span>
          </Link>

          {/* ─── Desktop Nav Links ─────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'text-yellow-400 bg-yellow-500/8'
                      : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-900/50'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ─── Action Buttons ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Admin Dashboard */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/5 text-slate-400 hover:text-amber-400 text-xs font-semibold transition-all duration-300"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Cart */}
            <button
              id="cart-button"
              onClick={onCartClick}
              className="relative p-2.5 rounded-full bg-slate-900/50 border border-slate-800 hover:border-yellow-400/50 hover:bg-slate-900 text-slate-300 hover:text-yellow-400 transition-all duration-300 group"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {mounted && cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[10px] font-bold text-slate-950 ring-2 ring-slate-950 shadow-md shadow-amber-500/30"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/252619550772"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10 text-yellow-400 text-sm font-semibold transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Seller</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-yellow-400 hover:bg-slate-900/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Menu ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/97 backdrop-blur-2xl border-b border-yellow-500/10 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-yellow-400 bg-yellow-500/10'
                        : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-900/60'
                    }`}
                  >
                    {label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                  </Link>
                );
              })}

              {/* Admin link in mobile menu */}
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  pathname === '/admin'
                    ? 'text-yellow-400 bg-yellow-500/10'
                    : 'text-slate-300 hover:text-yellow-400 hover:bg-slate-900/60'
                }`}
              >
                <Lock className="w-4 h-4" />
                Admin Dashboard
                {pathname === '/admin' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />}
              </Link>

              <div className="pt-3 space-y-2">
                <a
                  href="https://wa.me/252619550772"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Contact Seller via WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
