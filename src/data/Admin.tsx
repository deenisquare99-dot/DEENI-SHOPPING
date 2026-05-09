import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseService } from '../services/firebaseService';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '../data/mockData';
import { Product, Category, Brand } from '../types';
import { Icons } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';

type AdminTab = 'products' | 'categories' | 'brands' | 'orders';

export const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isSeeding, setIsSeeding] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const ADMIN_EMAIL = 'deenisquare99@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && u.email === ADMIN_EMAIL) {
        loadData();
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const loadData = async () => {
    const [p, c, b] = await Promise.all([
      firebaseService.getProducts(),
      firebaseService.getCategories(),
      firebaseService.getBrands()
    ]);
    if (p) setProducts(p);
    if (c) setCategories(c);
    if (b) setBrands(b);

    if (activeTab === 'orders') {
      const o = await firebaseService.getOrders();
      if (o) setOrders(o);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('অর্ডারটি মুছে ফেলতে চান?')) {
      try {
        await firebaseService.deleteOrder(id);
        toast.success('Order deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm('This will populate your database with initial sample data. Continue?')) return;
    setIsSeeding(true);
    const loadingToast = toast.loading('Seeding data...');
    try {
      // Seed Categories
      for (const cat of MOCK_CATEGORIES) {
        const { id, ...data } = cat;
        await firebaseService.addCategory(data);
      }
      // Seed Brands
      for (const brand of MOCK_BRANDS) {
        const { id, ...data } = brand;
        await firebaseService.addBrand(data);
      }
      // Seed Products
      for (const product of MOCK_PRODUCTS) {
        const { id, createdAt, ...data } = product;
        await firebaseService.addProduct(data as any);
      }
      toast.success('Database seeded successfully!', { id: loadingToast });
      loadData();
    } catch (error) {
      console.error('Seeding failed:', error);
      toast.error('Seeding failed. Check console.', { id: loadingToast });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const loadingToast = toast.loading(`Saving ${activeTab.slice(0, -1)}...`);
    
    try {
      if (activeTab === 'products') {
        const data = {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          price: Number(formData.get('price')),
          discountPrice: formData.get('discountPrice') ? Number(formData.get('discountPrice')) : undefined,
          category: formData.get('category') as string,
          images: [formData.get('image') as string],
          stock: Number(formData.get('stock')),
          isFeatured: formData.get('isFeatured') === 'on',
          isNewArrival: formData.get('isNewArrival') === 'on',
          isBestSeller: formData.get('isBestSeller') === 'on',
          ratings: 5,
          reviewsCount: 0,
        };
        if (editingItem) {
          await firebaseService.updateProduct(editingItem.id, data);
        } else {
          const productId = await firebaseService.addProduct(data as any);
          // Auto-add initial reviews for new products
          if (productId) {
            const autoReviews = [
              { userName: "জাহিদ হাসান", rating: 5, comment: "চমৎকার পণ্য! খুব দ্রুত ডেলিভারি পেয়েছি।", productId },
              { userName: "তানিয়া বিনতে", rating: 5, comment: "কোয়ালিটি অনেক ভাল, ছবিতে যেমন দেখেছি ঠিক তেমনই।", productId }
            ];
            for (const rev of autoReviews) {
              await firebaseService.addReview(rev);
            }
          }
        }
      } else if (activeTab === 'categories') {
        const data = {
          name: formData.get('name') as string,
          slug: formData.get('slug') as string,
          image: formData.get('image') as string,
        };
        await firebaseService.addCategory(data);
      } else if (activeTab === 'brands') {
        const data = {
          name: formData.get('name') as string,
          slug: formData.get('slug') as string,
          logo: formData.get('logo') as string,
        };
        await firebaseService.addBrand(data);
      }
      
      toast.success(`${activeTab.slice(0, -1)} saved!`, { id: loadingToast });
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      toast.error('Failed to save', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        if (activeTab === 'products') await firebaseService.deleteProduct(id);
        // Note: Category and Brand deletion not implemented in service yet but could be
        toast.success('Deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <div className="pt-32 text-center text-zinc-500 uppercase tracking-widest text-xs">Authenticating...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="pt-48 pb-24 text-center px-6 min-h-[70vh] flex flex-col justify-center items-center">
        <Toaster position="bottom-right" />
        <h1 className="text-4xl font-display font-black mb-8 uppercase tracking-tighter">DEENI <span className="text-luxury-gold">ADMIN</span></h1>
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 max-w-sm w-full mx-auto mb-12">
          <p className="mb-4 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Authorized Admin Email:</p>
          <p className="text-luxury-gold font-mono text-sm break-all">{ADMIN_EMAIL}</p>
        </div>
        <p className="mb-12 text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
          দয়া করে আপনার এডমিন ইমেইল দিয়ে লগইন করুন। অন্য ইমেইল ব্যবহার করলে আপনি পণ্য পরিবর্তন করতে পারবেন না।
        </p>
        <button 
          onClick={handleLogin}
          className="bg-luxury-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-800 transition-all border border-transparent active:scale-95 shadow-xl"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Toaster position="bottom-right" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-2">
            Dashboard
          </h1>
          <div className="flex gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Manage Inventory</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">•</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{user.email}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={seedDatabase}
            disabled={isSeeding}
            className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-luxury-gold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Icons.Package className="w-3 h-3" />
            {isSeeding ? 'Restoring...' : 'Restore Default Data (পণ্য ফিরিয়ে আনুন)'}
          </button>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-luxury-black text-white dark:bg-white dark:text-luxury-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-luxury-gold transition-all"
          >
            <Icons.Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-zinc-100 dark:border-zinc-800 mb-12">
        {(['products', 'categories', 'brands', 'orders'] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${
              activeTab === tab ? 'text-luxury-gold' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
            )}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-black/20">
        <div className="overflow-x-auto">
          {activeTab === 'orders' ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {orders.map((order) => (
                <div key={order.id} className="p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between mb-6 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Order Status</p>
                        <span className="bg-luxury-gold/10 text-luxury-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Customer Info</p>
                        <p className="text-sm font-bold">{order.customerName}</p>
                        <p className="text-xs text-zinc-500">{order.phone}</p>
                        <p className="text-xs text-zinc-500 mt-1">{order.address}, {order.city}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="text-xs">
                              <span className="font-bold">{item.name}</span>
                              <span className="text-zinc-400 mx-2">x</span>
                              <span>{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Financials</p>
                        <p className="text-sm font-bold text-luxury-gold">Total: {order.total} TK</p>
                        <p className="text-[9px] text-zinc-400 uppercase tracking-widest">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="flex items-start md:items-center">
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                      >
                        <Icons.Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950/50">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Preview & Info</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{activeTab === 'products' ? 'Price/Stock' : 'ID/Slug'}</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {activeTab === 'products' && products.map(item => (
                <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight mb-1">{item.name}</div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-luxury-gold">৳{item.discountPrice || item.price}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.stock} in stock</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                        <Icons.Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-zinc-400 hover:text-red-500 transition-all">
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {activeTab === 'categories' && categories.map(cat => (
                <tr key={cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100">
                        <img src={cat.image} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-sm">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-zinc-400 font-mono tracking-tighter">{cat.slug}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 text-zinc-300 cursor-not-allowed"><Icons.Trash className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}

              {activeTab === 'brands' && brands.map(brand => (
                <tr key={brand.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                        <img src={brand.logo} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-sm">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-zinc-400 font-mono tracking-tighter">{brand.slug}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 text-zinc-300 cursor-not-allowed"><Icons.Trash className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          
          {((activeTab === 'products' ? products : activeTab === 'categories' ? categories : activeTab === 'brands' ? brands : orders).length === 0) && (
            <div className="p-20 text-center flex flex-col items-center">
              <Icons.Package className="w-12 h-12 text-zinc-200 mb-4" />
              <p className="text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-bold">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl">
              <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-3xl font-display font-black uppercase tracking-tighter">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"><Icons.X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleSaveItem} className="p-10 grid grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {activeTab === 'products' ? (
                  <>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Product Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all" placeholder="e.g. Rolex Submariner" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Description</label>
                      <textarea name="description" defaultValue={editingItem?.description} required rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none focus:ring-2 ring-luxury-gold/20 transition-all custom-scrollbar" placeholder="Item details..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Original Price (৳)</label>
                      <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Discount Price (৳)</label>
                      <input name="discountPrice" type="number" defaultValue={editingItem?.discountPrice} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Category</label>
                      <select name="category" defaultValue={editingItem?.category} className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none appearance-none">
                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Stock Units</label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock || 0} required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Image URL</label>
                      <input name="image" defaultValue={editingItem?.images[0]} required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" placeholder="https://..." />
                    </div>
                    <div className="col-span-2 flex flex-wrap gap-8 mt-4 bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                      {(['isFeatured', 'isNewArrival', 'isBestSeller'] as const).map(flag => (
                        <label key={flag} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" name={flag} defaultChecked={editingItem?.[flag]} className="w-5 h-5 accent-luxury-gold" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-luxury-black dark:group-hover:text-white transition-colors">
                            {flag.replace('is', '').replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : activeTab === 'categories' ? (
                  <>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Category Name</label>
                      <input name="name" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" placeholder="e.g. Luxury Watches" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Slug (Link)</label>
                      <input name="slug" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" placeholder="luxury-watches" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Header Image URL</label>
                      <input name="image" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Brand Name</label>
                      <input name="name" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" placeholder="e.g. Rolex" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Slug</label>
                      <input name="slug" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" placeholder="rolex" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Logo URL</label>
                      <input name="logo" required className="w-full bg-zinc-50 dark:bg-zinc-800 border-none p-5 rounded-2xl outline-none" />
                    </div>
                  </>
                )}

                <div className="col-span-2 mt-8">
                  <button type="submit" className="w-full bg-luxury-black text-white dark:bg-white dark:text-luxury-black p-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-luxury-gold hover:text-white transition-all active:scale-[0.98]">
                    Save {activeTab.slice(0, -1)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}</style>
    </div>
  );
};
