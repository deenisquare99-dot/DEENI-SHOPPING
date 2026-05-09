import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';

export const Footer = () => {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col leading-tight mb-6">
              <span className="text-3xl font-display font-black tracking-[0.05em] uppercase text-luxury-black dark:text-white">
                DEENI
              </span>
              <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-luxury-gold -mt-0.5">
                Shopping
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
              Experience the pinnacle of luxury with our curated collection of premium watches and fashion accessories.
            </p>
            <div className="flex space-x-6">
              <a href="https://www.facebook.com/share/1bi5sqf2M3/" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors"><Icons.Facebook className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/deenishopping?igsh=em55d3U3dmQwdTdt" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors"><Icons.Instagram className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@DeeniShopping" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors"><Icons.Youtube className="w-5 h-5" /></a>
              <a href="https://www.tiktok.com/@deenishopping?_r=1&_t=ZS-96DEmGd9XDr" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors"><Icons.TikTok className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/shop" className="hover:text-luxury-gold">Shop All</Link></li>
              <li><Link to="/shop?category=mens" className="hover:text-luxury-gold">Men's Watches</Link></li>
              <li><Link to="/shop?category=womens" className="hover:text-luxury-gold">Women's Collection</Link></li>
              <li><Link to="/about" className="hover:text-luxury-gold">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Customer Care</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/track" className="hover:text-luxury-gold">Order Tracking</Link></li>
              <li><Link to="/faq" className="hover:text-luxury-gold">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-luxury-gold">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-gold">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Service Hours</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-center">
                <Icons.Success className="w-4 h-4 mr-3 text-luxury-gold" />
                <span>২৪ ঘণ্টা খোলা (Always Open)</span>
              </li>
              <li className="text-[10px] uppercase tracking-wider text-zinc-400">
                সপ্তাহের ৭ দিন ই আমাদের সেবা পাবেন
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-zinc-400 gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p>© 2025 DEENI SHOPPING. ALL RIGHTS RESERVED.</p>
            <Link to="/admin" className="opacity-30 hover:opacity-100 hover:text-luxury-gold transition-all">Admin Dashboard</Link>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <span className="flex items-center gap-2"><Icons.Secure className="w-3 h-3" /> Secure Payments</span>
             <span className="flex items-center gap-2 group cursor-pointer"><Icons.Delivery className="w-3 h-3 group-hover:text-luxury-gold" /> Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
