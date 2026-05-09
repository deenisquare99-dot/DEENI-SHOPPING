import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from '../constants';
import { useCart } from '../contexts/CartContext';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Track Order', path: '/track' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <> 
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-white py-1 px-4 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center fixed top-0 w-full z-[70]">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Icons.Delivery className="w-3 h-3 text-luxury-gold" /> Free Shipping</span>
          <span className="flex items-center gap-1 hidden md:flex"><Icons.Secure className="w-3 h-3 text-luxury-gold" /> Official Warranty</span>
        </div>
        <div className="text-luxury-gold animate-pulse">⚡ সারা বাংলাদেশে ফাস্ট ডেলিভারি</div>
      </div>

      <nav className={cn(
        "fixed top-[24px] left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-red-700 shadow-xl" : "bg-red-600"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <span className="text-red-700 font-black text-lg md:text-xl italic">D</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-xl md:text-3xl tracking-tighter uppercase italic">Deeni</span>
                <span className="text-white/80 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase">Shopping</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    "text-white/90 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors",
                    location.pathname === link.path && "text-white underline underline-offset-4 decoration-2"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-white hidden md:block hover:scale-110 transition-transform">
                <Icons.User className="w-5 h-5" />
              </Link>
              
              <Link to="/checkout" className="relative group">
                <Icons.Cart className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 bg-white text-red-700 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-red-700">
                  {totalItems}
                </span>
              </Link>

              <button 
                className="lg:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar Block */}
          <div className="pb-3 pt-1">
            <form onSubmit={handleSearch} className="relative flex w-full">
              <input 
                type="text" 
                placeholder="Search for watches..." 
                className="w-full h-8 md:h-10 px-4 pr-12 bg-white text-zinc-900 text-xs md:text-sm outline-none rounded-sm border-none shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full w-10 md:w-12 bg-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-300 transition-colors"
              >
                <Icons.Search className="w-4 h-4 md:w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-zinc-100 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-zinc-500 font-bold uppercase tracking-widest text-xs py-2 border-b border-zinc-50 transition-colors",
                      location.pathname === link.path && "text-red-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacing for fixed navbar */}
      <div className="h-[120px] md:h-[140px]"></div>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 px-2 py-2 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <Link to="/shop" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/shop' ? "text-red-600" : "text-zinc-500")}>
          <Icons.Package className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Watches</span>
        </Link>
        <a href="https://wa.me/8801629232000" className="flex flex-col items-center gap-1 text-green-500">
          <Icons.WhatsApp className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">WhatsApp</span>
        </a>
        <Link to="/checkout" className={cn("flex flex-col items-center gap-1 transition-colors", location.pathname === '/checkout' ? "text-red-600" : "text-zinc-500")}>
          <div className="relative">
            <Icons.Cart className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase">Cart</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex flex-col items-center gap-1 text-zinc-500 focus:outline-none">
          <Icons.Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Menu</span>
        </button>
      </div>
    </>
  );
};
