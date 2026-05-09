import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { firebaseService } from '../services/firebaseService';
import { Product, Category, Brand, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';

const INITIAL_REVIEWS = [
  {
    userName: "রাকিব হাসান",
    rating: 5,
    comment: "ঘড়িটার ফিনিশিং অসাধারন! ঠিক যেমনটা ছবিতে দেখেছি তেমনটাই পেয়েছি। দ্রুত ডেলিভারির জন্য ধন্যবাদ।"
  },
  {
    userName: "সুমাইয়া আক্তার",
    rating: 5,
    comment: "অল্প দামে এত ভালো কোয়ালিটির ঘড়ি পাবো ভাবিনি। ডিজাইনটা সত্যিই প্রিমিয়াম। সবার জন্য রিকমেন্ডেড।"
  },
  {
    userName: "তানিয়া সুলতানা",
    rating: 4,
    comment: "প্যাকিং খুব ভালো ছিল। ঘড়িটা অনেক স্টাইলিশ। একটু দেরি করে এসেছিল কিন্তু পন্যটি ভালো।"
  },
  {
    userName: "আরিফ আহমেদ",
    rating: 5,
    comment: "ঢাকার ভেতরে এক দিনেই ডেলিভারি পেয়েছি। ঘড়িটা বেশ ওজনদার এবং মজবুত মনে হচ্ছে।"
  },
  {
    userName: "জাহিদ হোসেন",
    rating: 5,
    comment: "আমি নিয়মিত কাস্টমার। তাদের ঘড়িগুলো সব সময়ই কোয়ালিটি সম্পন্ন হয়। এবারেরটা তো সেরা।"
  },
  {
    userName: "নুসরাত জাহান",
    rating: 5,
    comment: "গিফট দেওয়ার জন্য পারফেক্ট। বক্সে প্যাকিং এতো প্রিমিয়াম ছিল যে আলাদা করে আর কিছু করতে হয়নি।"
  },
  {
    userName: "ফাহিম মুনতাসির",
    rating: 4,
    comment: "ভাল পণ্য। সেলার খুব আন্তরিক, হোয়াটসঅ্যাপে সব বিস্তারিত বুঝিয়ে দিয়েছেন। ধন্যবাদ দ্বীনি শপিং।"
  },
  {
    userName: "আসমাউল হুসনা",
    rating: 5,
    comment: "লেডিস চেইন ঘড়িটা অসম্ভব সুন্দর। সোনার মতো কালার পালিশটা খুব চকচকে। আই অ্যাম হ্যাপি।"
  },
  {
    userName: "কামরুল হাসান",
    rating: 5,
    comment: "অরিজিনাল স্মার্ট ওয়াচটি পেয়েছি। কালারটা খুব লাক্সারি ভাইব দিচ্ছে। ডেলিভারি বয় খুব ভাল ছিল।"
  },
  {
    userName: "জান্নাতুল ফেরদৌস",
    rating: 5,
    comment: "খুব সুন্দর অভিজ্ঞ্তা। আমি অনলাইনে অনেক কেনাকাটা করি, দ্বীনি শপিং অন্যতম বিশ্বস্ত জায়গা।"
  }
];

export const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeReview, setActiveReview] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2670&auto=format&fit=crop",
      title: "Elevate Your",
      subtitle: "Lifestyle",
      description: "Premium selection for the modern generation."
    },
    {
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2670&auto=format&fit=crop",
      title: "Timeless",
      subtitle: "Elegance",
      description: "Exquisite craftsmanship in every detail."
    },
    {
      image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2670&auto=format&fit=crop",
      title: "Luxury",
      subtitle: "Reimagined",
      description: "Defining sophistication and style."
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, c, b, r] = await Promise.all([
          firebaseService.getProducts(),
          firebaseService.getCategories(),
          firebaseService.getBrands(),
          firebaseService.getReviews()
        ]);
        if (p) setProducts(p);
        if (c) setCategories(c);
        if (b) setBrands(b);
        if (r && r.length > 0) {
          setReviews(r);
        } else {
          setReviews(INITIAL_REVIEWS.map((r, i) => ({ id: `init-${i}`, ...r, createdAt: new Date().toISOString() })) as any);
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePostReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      userName: formData.get('userName') as string,
      comment: formData.get('comment') as string,
      rating: rating,
    };

    try {
      await firebaseService.addReview(data);
      setIsReviewModalOpen(false);
      // Reload reviews
      const r = await firebaseService.getReviews();
      if (r) setReviews(r);
    } catch (error) {
      console.error("Failed to post review:", error);
    }
  };

  useEffect(() => {
    if (reviews.length > 1) {
      const timer = setInterval(() => {
        setActiveReview((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [reviews]);

  const featuredProducts = products.filter(p => p.isFeatured);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="overflow-x-hidden bg-zinc-50 dark:bg-black">
      {/* Hero Section - Auto Carousel */}
      <section className="relative h-[48vh] md:h-[65vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img 
              src={heroSlides[currentSlide].image} 
              alt="Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/20 md:to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-20">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl"
              >
                <div className="flex flex-col">
                  <span className="text-red-500 font-black text-xs md:text-sm uppercase tracking-[0.3em] mb-2">{heroSlides[currentSlide].title}</span>
                  <h1 className="text-white text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    {heroSlides[currentSlide].subtitle}
                  </h1>
                </div>
                <p className="text-white/60 text-[10px] md:text-sm mt-4 font-bold uppercase tracking-widest max-w-sm">
                  {heroSlides[currentSlide].description}
                </p>
                <div className="mt-8">
                  <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-2xl">Explore Now</Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "bg-red-600 w-8" : "bg-white/40"
              )}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-4 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: Icons.Delivery, title: "Fast Delivery", sub: "All over BD" },
               { icon: Icons.Secure, title: "Secure Pay", sub: "COD Available" },
               { icon: Icons.WhatsApp, title: "24/7 Support", sub: "WhatsApp Us" },
               { icon: Icons.Star, title: "Best Quality", sub: "Original Products" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center text-center">
                 <stat.icon className="w-5 h-5 mb-1 text-red-600" />
                 <h4 className="text-[10px] font-black uppercase tracking-tighter">{stat.title}</h4>
                 <p className="text-[8px] text-zinc-400 font-bold uppercase">{stat.sub}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections - Bento Tighter */}
      <section className="py-10 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Categories</span>
            <h2 className="text-3xl font-display font-black uppercase tracking-tighter">Featured <span className="text-red-600">Collections</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3"> 
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                className="group relative h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-white text-[10px] font-bold uppercase tracking-widest">{cat.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular Brands */}
      <section className="py-16 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">World Class</span>
          <h2 className="text-4xl font-display font-light mb-12">Most Popular <span className="font-bold">Brands</span></h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 hover:opacity-100 transition-opacity">
            {brands.map((brand) => (
              <motion.div
                key={brand.id}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-4 group cursor-pointer"
                onClick={() => window.location.href = `/shop?brand=${brand.slug}`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-luxury-gold transition-all p-1">
                   <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                   />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-luxury-gold transition-colors">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Selection</span>
            <h2 className="text-4xl font-display font-light">Trending <span className="font-bold">Watches</span></h2>
            <div className="w-16 h-[1px] bg-luxury-gold mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950 px-6 overflow-hidden border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block">Our Community</span>
              <h2 className="text-5xl md:text-7xl font-display font-light mb-8 uppercase tracking-tighter leading-none">Voices of <br/><span className="font-bold italic">Deeni.</span></h2>
              <p className="text-zinc-500 max-w-md mb-12 leading-relaxed text-sm">
                আমরা আমাদের প্রতিটি গ্রাহকের মূল্যবান মতামতকে সম্মান করি। আপনার অভিজ্ঞতা আমাদের আরো বড় হওয়ার প্রেরণা যোগায়।
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-luxury-black text-white dark:bg-white dark:text-luxury-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-luxury-gold hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Write a Review (রিভিউ দিন)
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -left-20 text-[180px] font-display font-black text-zinc-100 dark:text-zinc-900 select-none pointer-events-none opacity-50">
                “
              </div>
              
              <div className="relative min-h-[350px] bg-white dark:bg-zinc-900 rounded-[3rem] p-12 md:p-16 shadow-2xl flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {reviews.length > 0 && (
                    <motion.div
                      key={activeReview}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10"
                    >
                      <div className="flex gap-1 mb-8">
                        {[...Array(5)].map((_, i) => (
                          <Icons.Star 
                            key={i} 
                            className={`w-4 h-4 ${i < reviews[activeReview].rating ? 'text-luxury-gold fill-luxury-gold' : 'text-zinc-200'}`} 
                          />
                        ))}
                      </div>
                      <blockquote className="text-xl md:text-2xl font-light italic text-zinc-800 dark:text-zinc-200 mb-10 leading-relaxed font-display">
                        "{reviews[activeReview].comment}"
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-luxury-gold to-zinc-400 flex items-center justify-center text-white font-bold text-sm">
                          {reviews[activeReview].userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest">{reviews[activeReview].userName}</h4>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">Verified Client</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Dots */}
                <div className="absolute right-12 bottom-12 flex gap-3">
                  {reviews.slice(0, 5).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReview(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        activeReview === i ? 'w-6 bg-luxury-gold' : 'bg-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsReviewModalOpen(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 100, scale: 0.9 }} 
              className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter">SHARE YOUR <span className="text-luxury-gold">STORY</span></h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"><Icons.X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handlePostReview} className="p-10 space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Your Name (আপনার নাম)</label>
                  <input name="userName" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all font-bold" placeholder="e.g. Abdullah Hasan" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Rating (আপনার রেটিং)</label>
                  <div className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all ${rating >= star ? 'scale-125' : 'opacity-30'}`}
                      >
                        <Icons.Star className={`w-8 h-8 ${rating >= star ? 'text-luxury-gold fill-luxury-gold' : 'text-zinc-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Your Experience (মতামত বা মন্তব্য লিখুন)</label>
                  <textarea name="comment" required rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all resize-none" placeholder="পণ্যটি কেমন লেগেছে তা লিখুন..." />
                </div>

                <button type="submit" className="w-full bg-luxury-black text-white dark:bg-white dark:text-luxury-black p-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-luxury-gold hover:text-white transition-all active:scale-[0.98] shadow-2xl">
                  Post Review (রিভিউ দিন)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instagram Gallery */}
      <section className="py-24 bg-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-light text-white">#Deeni<span className="font-bold">Lifestyle</span></h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">Follow our journey on Instagram</p>
          </div>
          <a href="#" className="text-[10px] font-bold text-white uppercase tracking-widest border-b border-white/20 pb-1">Follow @DeeniShopping</a>
        </div>
        <div className="flex gap-4">
           {[
             "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600",
             "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600",
             "https://images.unsplash.com/photo-1549482199-01ae3b2a21ee?w=600",
             "https://images.unsplash.com/photo-1522337360788-8b13df772ad5?w=600",
             "https://images.unsplash.com/photo-1511499767350-a1590fdb7351?w=600"
           ].map((img, i) => (
             <div key={i} className="min-w-[300px] h-[300px] grayscale hover:grayscale-0 transition-all duration-700">
               <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
           ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Icons.Send className="w-10 h-10 mx-auto mb-8 text-luxury-gold opacity-50" />
          <h2 className="text-4xl font-display font-light mb-6">Join Deeni <span className="font-bold">Family</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10">আমাদের ফ্যামিলিতে যোগ দিন এবং নতুন পন্য ও স্পেশাল অফার সবার আগে আপনার ইমেইলে পান।</p>
          <form className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-6 py-4 outline-none focus:border-luxury-gold transition-colors text-sm"
            />
            <button className="btn-premium btn-primary whitespace-nowrap">Subscribe</button>
          </form>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/8801629232000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <Icons.WhatsApp className="w-6 h-6" />
      </a>
    </div>
  );
};
