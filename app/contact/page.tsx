'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Send,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SELLER_WHATSAPP = '252619550772';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Your name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.subject.trim()) errs.subject = 'Please enter a subject';
    if (!form.message.trim()) errs.message = 'Message cannot be empty';

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const text =
      `📬 *SYL SHOPPING CENTER - CONTACT MESSAGE*\n` +
      `=========================\n\n` +
      `👤 *From:* ${form.name}\n` +
      `📞 *Phone:* ${form.phone}\n` +
      `📋 *Subject:* ${form.subject}\n\n` +
      `💬 *Message:*\n${form.message}\n\n` +
      `=========================\n` +
      `Sent via SYL Shopping Center Contact Form.`;

    window.open(`https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
    setForm({ name: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      Icon: Phone,
      label: 'WhatsApp & Phone',
      value: '+252 61 955 0772',
      sub: 'Available 8am – 10pm daily',
      href: `https://wa.me/${SELLER_WHATSAPP}`,
    },
    {
      Icon: MapPin,
      label: 'Our Location',
      value: 'Mogadishu, Somalia',
      sub: 'Hodan District, Main Street',
      href: '#',
    },
    {
      Icon: Clock,
      label: 'Working Hours',
      value: 'Every Day',
      sub: '8:00 AM – 10:00 PM (EAT)',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden relative">
      {/* Ambient orbs */}
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Navbar onCartClick={() => {}} />

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>We're here to help</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
            Get in Touch with{' '}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              SYL Shopping
            </span>
          </h1>
          <p className="text-slate-400 font-light text-lg leading-relaxed">
            Questions, custom orders, or just want to say hello? Fill out the form and we'll reach out to you on WhatsApp within minutes.
          </p>
        </motion.div>
      </section>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ─ Sidebar Info ──────────────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            {contactInfo.map(({ Icon, label, value, sub, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-yellow-500/25 transition-all duration-300 group block"
              >
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                  <p className="font-bold text-white text-sm">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </a>
            ))}

            {/* WhatsApp Direct CTA */}
            <a
              href={`https://wa.me/${SELLER_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-green-600/20 to-emerald-600/10 border border-green-600/25 hover:border-green-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-600/20 text-green-400 flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Chat on WhatsApp</p>
                  <p className="text-xs text-slate-400">Fastest response. Usually within 5 mins.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Social Links */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  {
                    label: 'Instagram',
                    color: 'from-pink-500/10 to-rose-500/10',
                    border: 'border-pink-500/20 hover:border-pink-500/40',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  {
                    label: 'Facebook',
                    color: 'from-blue-500/10 to-blue-600/10',
                    border: 'border-blue-500/20 hover:border-blue-500/40',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                  },
                ].map(({ label, color, border, icon }) => (
                  <a
                    key={label}
                    href="#"
                    className={`flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl bg-gradient-to-r ${color} border ${border} text-slate-300 hover:text-white text-xs font-semibold transition-all duration-200`}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* ─ Contact Form ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8">

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-5"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-slate-400 leading-relaxed max-w-sm">
                        Your message has been formatted and opened in WhatsApp. We'll reply to you very soon!
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-1">Send Us a Message</h2>
                      <p className="text-slate-400 text-sm">We'll respond via WhatsApp immediately.</p>
                    </div>

                    {/* Name & Phone (2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Your Full Name <span className="text-yellow-500">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          placeholder="Fadumo Ali"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${errors.name ? 'border-red-500/60' : 'border-slate-800 focus:border-yellow-500/50'} text-slate-200 text-sm focus:outline-none transition-all placeholder:text-slate-600`}
                        />
                        {errors.name && <p className="text-[11px] text-red-400 mt-1.5">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Phone Number <span className="text-yellow-500">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          placeholder="+252 61 955 0772"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${errors.phone ? 'border-red-500/60' : 'border-slate-800 focus:border-yellow-500/50'} text-slate-200 text-sm focus:outline-none transition-all placeholder:text-slate-600`}
                        />
                        {errors.phone && <p className="text-[11px] text-red-400 mt-1.5">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Subject <span className="text-yellow-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="contact-subject"
                          value={form.subject}
                          onChange={(e) => update('subject', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${errors.subject ? 'border-red-500/60' : 'border-slate-800 focus:border-yellow-500/50'} text-sm focus:outline-none transition-all appearance-none cursor-pointer ${form.subject ? 'text-slate-200' : 'text-slate-600'}`}
                        >
                          <option value="" disabled>Select a subject...</option>
                          <option value="Product Inquiry">Product Inquiry</option>
                          <option value="Custom Order Request">Custom Order Request</option>
                          <option value="Bulk / Wholesale Order">Bulk / Wholesale Order</option>
                          <option value="Order Status">Order Status</option>
                          <option value="Return or Exchange">Return or Exchange</option>
                          <option value="Delivery Question">Delivery Question</option>
                          <option value="Other">Other</option>
                        </select>
                        <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
                      </div>
                      {errors.subject && <p className="text-[11px] text-red-400 mt-1.5">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Message <span className="text-yellow-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Tell us how we can help you..."
                        className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${errors.message ? 'border-red-500/60' : 'border-slate-800 focus:border-yellow-500/50'} text-slate-200 text-sm focus:outline-none transition-all resize-none placeholder:text-slate-600`}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        {errors.message ? (
                          <p className="text-[11px] text-red-400">{errors.message}</p>
                        ) : (
                          <span />
                        )}
                        <span className={`text-[11px] ${form.message.length > 400 ? 'text-yellow-400' : 'text-slate-600'}`}>
                          {form.message.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-base hover:shadow-xl hover:shadow-yellow-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </button>

                    <p className="text-center text-xs text-slate-600 pt-1">
                      Your message will open in WhatsApp, pre-formatted and ready to send.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span className="font-bold text-slate-300">SYL Shopping Center</span>
          </div>
          <div className="flex gap-5 text-sm text-slate-500">
            <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-yellow-400 transition-colors">Products</Link>
            <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-700" suppressHydrationWarning>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> SYL Shopping Center
          </p>
        </div>
      </footer>
    </div>
  );
}
