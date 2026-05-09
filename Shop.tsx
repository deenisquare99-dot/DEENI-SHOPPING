import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Icons } from '../constants';
import { cn } from '../lib/utils';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [activeBrand, setActiveBrand] = useState(searchParams.get('brand') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, c] = await Promise.all([
          firebaseService.getProducts(),
          firebaseService.getCategories()
        ]);
        if (p) setProducts(p);
        if (c) setCategories(c);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    if (cat) setActiveCategory(cat);
    if (brand) setActiveBrand(brand);
  }, [searchParams]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesBrand = activeBrand === 'all' || product.name.toLowerCase().includes(activeBrand.toLowerCase());
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Default newest
  });

  if (loading) {
    return <div className="pt-48 text-center text-zinc-500 uppercase tracking-widest text-xs">Exploring the collection...</div>;
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-display font-light mb-4">The <span className="font-bold">Collection</span></h1>
            <p className="text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-[0.3em]">Exquisite craftsmanship for every wrist</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <div className="relative flex-grow md:flex-grow-0">
               <input 
                type="text" 
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-3 pl-10 pr-4 outline-none focus:border-luxury-gold transition-colors text-xs uppercase tracking-widest"
               />
               <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
             </div>
             
             <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 py-3 px-4 outline-none text-xs uppercase tracking-widest cursor-pointer"
             >
               <option value="newest">Newest First</option>
               <option value="price-low">Price: Low to High</option>
               <option value="price-high">Price: High to Low</option>
             </select>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-3 mb-12 pb-4 no-scrollbar -mx-6 px-6">
          <button
            onClick={() => { setActiveCategory('all'); setActiveBrand('all'); setSearchParams({}); }}
            className={cn(
              "px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 whitespace-nowrap rounded-full",
              activeCategory === 'all' && activeBrand === 'all'
                ? "bg-luxury-black text-white dark:bg-white dark:text-luxury-black border-transparent shadow-lg" 
                : "border-zinc-200 dark:border-zinc-800 hover:border-luxury-gold text-zinc-500"
            )}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); setActiveBrand('all'); setSearchParams({ category: cat.slug }); }}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 whitespace-nowrap rounded-full",
                activeCategory === cat.slug 
                  ? "bg-luxury-black text-white dark:bg-white dark:text-luxury-black border-transparent shadow-lg" 
                  : "border-zinc-200 dark:border-zinc-800 hover:border-luxury-gold text-zinc-500"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-zinc-500 uppercase tracking-widest text-sm">No items found matching your criteria.</p>
            <button 
              onClick={() => { setActiveCategory('all'); setActiveBrand('all'); setSearchQuery(''); setSearchParams({}); }}
              className="mt-6 text-luxury-gold uppercase tracking-widest text-[10px] font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
