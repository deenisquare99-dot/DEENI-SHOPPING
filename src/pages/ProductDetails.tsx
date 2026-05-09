import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { firebaseService } from '../services/firebaseService';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Icons } from '../constants';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await firebaseService.getProducts();
        const found = products?.find(p => p.id === id);
        if (found) setProduct(found);
        
        const r = await firebaseService.getReviews(id);
        if (r && r.length > 0) {
          setReviews(r);
        } else {
          // Fallback to initial reviews
          const fallback = [
            { id: 'fb-1', userName: "রাকিব হাসান", rating: 5, comment: "ঘড়িটা হাতে পেয়ে অবাক হয়েছি! অনেক প্রিমিয়াম।", createdAt: new Date().toISOString() },
            { id: 'fb-2', userName: "মুনতাহা", rating: 5, comment: "যেমনটা চেয়েছিলাম তেমনটাই পেয়েছি।", createdAt: new Date().toISOString() }
          ] as Review[];
          setReviews(fallback);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handlePostReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      productId: id!,
      userName: formData.get('userName') as string,
      comment: formData.get('comment') as string,
      rating: rating,
    };

    try {
      await firebaseService.addReview(data);
      setIsReviewModalOpen(false);
      // Reload reviews
      const r = await firebaseService.getReviews(id);
      if (r) setReviews(r);
      toast.success('Review published! (আপনার রিভিউটি পাবলিশ হয়েছে)');
    } catch (error) {
      console.error("Failed to post review:", error);
      toast.error('Failed to post review');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
      navigate('/checkout');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) return <div className="pt-48 text-center uppercase tracking-widest text-xs">Loading timepiece details...</div>;

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h2 className="text-2xl font-display mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-luxury-gold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Gallery */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-zinc-50 dark:bg-zinc-900 overflow-hidden mb-4 relative"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-24 border-2 transition-all ${
                    selectedImage === i ? 'border-luxury-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <p className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">
                {product.category.replace('-', ' ')}
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-light mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-luxury-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icons.Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">({product.reviewsCount} Reviews)</span>
              </div>
              <div className="flex items-center gap-4 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-luxury-gold">{formatPrice(product.discountPrice)}</span>
                    <span className="text-xl text-zinc-400 line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
               <div className="flex items-center gap-4 p-4 border border-zinc-100 dark:border-zinc-800">
                 <Icons.Delivery className="w-6 h-6 text-zinc-400" />
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery</p>
                   <p className="text-[10px] text-zinc-500 uppercase">2-3 Business Days</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 p-4 border border-zinc-100 dark:border-zinc-800">
                 <Icons.Secure className="w-6 h-6 text-zinc-400" />
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest">Original Product</p>
                   <p className="text-[10px] text-zinc-500 uppercase">Authenticity Guaranteed</p>
                 </div>
               </div>
            </div>

            <div className="flex flex-col gap-6">
              <button
                onClick={handleBuyNow}
                className="btn-premium btn-primary flex-grow flex flex-col items-center justify-center gap-1 py-5 shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:shadow-[0_0_70px_rgba(212,175,55,0.5)] transition-all scale-105"
              >
                <div className="flex items-center gap-3">
                  <Icons.Cart className="w-6 h-6 animate-pulse" /> 
                  <span className="text-lg">অর্ডার করুন (ORDER NOW)</span>
                </div>
                <span className="text-[9px] opacity-70 tracking-widest font-normal">এক ক্লিকেই ক্যাশ অন ডেলিভারিতে অর্ডার</span>
              </button>
              
              <a 
                href={`https://wa.me/8801629232000?text=I'm interested in the ${product?.name}. Direct Link: ${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#128C7E] transition-colors rounded-xl shadow-lg"
              >
                <Icons.WhatsApp className="w-5 h-5" /> সরাসরি হোয়াটসঅ্যাপে অর্ডার করুন
              </a>
            </div>

            <button 
              onClick={handleAddToCart}
              className="mt-4 w-full text-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-luxury-gold transition-colors flex items-center justify-center gap-2"
            >
              <Icons.Plus className="w-3 h-3" /> Add to Cart (কার্টে যোগ করুন)
            </button>

          </div>
        </div>

        {/* Product Tabs/Specs */}
        <div className="mt-24 border-t border-zinc-100 dark:border-zinc-800 pt-16">
          <div className="flex gap-12 mb-12 border-b border-zinc-100 dark:border-zinc-800">
             <button className="pb-4 border-b-2 border-luxury-gold text-xs font-bold uppercase tracking-widest">Specifications</button>
             <button className="pb-4 border-b-2 border-transparent text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Reviews</button>
          </div>
          <div className="max-w-2xl">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Material</div>
              <div className="text-xs uppercase tracking-wider">Premium Stainless Steel</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Movement</div>
              <div className="text-xs uppercase tracking-wider">Japanese Quartz</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Water Resistance</div>
              <div className="text-xs uppercase tracking-wider">5 ATM / 50 Meters</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Case Diameter</div>
              <div className="text-xs uppercase tracking-wider">42mm</div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-32 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-zinc-100 dark:border-zinc-800 pb-12">
            <div>
              <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Product Feedback</span>
              <h2 className="text-4xl font-display font-light uppercase tracking-tight">Customer <span className="font-bold">Reviews</span></h2>
            </div>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="px-8 py-4 bg-luxury-black text-white dark:bg-white dark:text-luxury-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl active:scale-95"
            >
              Submit a Review (আপনার মতামত দিন)
            </button>
          </div>

          <div className="space-y-12">
            {reviews.length > 0 ? reviews.map((rev) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={rev.id} 
                className="pb-12 border-b border-zinc-50 dark:border-zinc-900 last:border-0"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-zinc-400">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em]">{rev.userName}</h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Icons.Star 
                            key={i} 
                            className={`w-2.5 h-2.5 ${i < rev.rating ? 'text-luxury-gold fill-luxury-gold' : 'text-zinc-200'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm ml-16 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl rounded-tl-none italic">
                  "{rev.comment}"
                </p>
              </motion.div>
            )) : (
              <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-950 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <Icons.Package className="w-12 h-12 text-zinc-200 mx-auto mb-6 opacity-20" />
                <p className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold">No reviews for this masterpiece yet</p>
                <button onClick={() => setIsReviewModalOpen(true)} className="mt-6 text-luxury-gold text-[10px] font-bold uppercase tracking-[0.2em] hover:underline">Be the first to review</button>
              </div>
            )}
          </div>
        </section>

        {/* Review Modal */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReviewModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
              <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.9 }} className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl">
                <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                  <h3 className="text-3xl font-display font-black uppercase tracking-tighter">SHARE YOUR <span className="text-luxury-gold text-italic">EXPERIENCE</span></h3>
                  <button onClick={() => setIsReviewModalOpen(false)} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"><Icons.X className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handlePostReview} className="p-10 space-y-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Display Name (আপনার নাম)</label>
                    <input name="userName" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all font-bold" placeholder="e.g. Rakib" />
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
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Your Remark (আপনার মন্তব্য)</label>
                    <textarea name="comment" required rows={4} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all resize-none" placeholder="Write something about the product..." />
                  </div>

                  <button type="submit" className="w-full bg-luxury-black text-white dark:bg-white dark:text-luxury-black p-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-luxury-gold hover:text-white transition-all active:scale-[0.98] shadow-2xl">
                    Publish Feedback (পাবলিশ করুন)
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
