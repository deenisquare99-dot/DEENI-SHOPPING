import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Icons } from '../constants';
import { firebaseService } from '../services/firebaseService';

export const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    promoCode: '',
    paymentMethod: 'cod'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleApplyPromo = () => {
    const code = formData.promoCode.toUpperCase().trim();
    if (code === 'DEENI5') {
      setDiscount(totalPrice * 0.05);
      alert('প্রোমো কোড সফল! ৫% ডিসকাউন্ট যোগ করা হয়েছে।');
    } else if (formData.promoCode.trim() !== '') {
      alert('ভুল প্রোমো কোড। আবার চেষ্টা করুন।');
    }
  };

  const shippingCost = formData.city === 'Dhaka' ? 60 : 120;
  const finalTotal = totalPrice - discount + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    
    try {
      const order = {
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.discountPrice || item.price
        })),
        subtotal: totalPrice,
        discount: discount,
        shipping: shippingCost,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
      };

      const newId = await firebaseService.createOrder(order);
      if (newId) {
        setOrderId(newId);
        clearCart();
        setIsSuccess(true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("অর্ডার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsOrdering(false);
    }
  };

  if (isSuccess) {
    const waMessage = `নতুন অর্ডার এসেছে!\nঅর্ডার আইডি: ${orderId}\nনাম: ${formData.fullName}\nফোন: ${formData.phone}\nঠিকানা: ${formData.address}\nমোট টাকা: ${finalTotal} TK`;
    const waLink = `https://wa.me/8801629232000?text=${encodeURIComponent(waMessage)}`;

    return (
      <div className="pt-48 pb-32 max-w-2xl mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-luxury-gold text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-luxury-gold/50">
          <Icons.Success className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display font-light mb-6">আন্তরিকভাবে <span className="font-bold text-luxury-gold">ধন্যবাদ!</span></h2>
        
        {orderId && (
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 mb-8 inline-block px-10">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">আপনার অর্ডার আইডি (Order ID)</p>
            <p className="text-xl font-mono font-bold text-luxury-gold">{orderId}</p>
          </div>
        )}

        <div className="space-y-6 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-12">
          <p>
            আপনার মূল্যবান অর্ডারটি আমাদের কাছে সাফল্যের সাথে পৌঁছেছে। দ্বীনি শপিং-এর ওপর আপনার এই অগাধ বিশ্বাস আমাদের সামনের পথে এগিয়ে যাওয়ার প্রেরণা জোগায়।
          </p>
          <p>
            আমরা খুব শীঘ্রই আমাদের প্রতিনিধি মারফত আপনার সাথে যোগাযোগ করব। 
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#128C7E] transition-colors rounded-xl shadow-lg"
          >
            <Icons.WhatsApp className="w-5 h-5" /> অর্ডারটি হোয়াটসঅ্যাপে শেয়ার করুন
          </a>
          <button 
            onClick={() => navigate('/')} 
            className="btn-premium btn-primary w-full py-4"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-32 text-center">
        <h2 className="text-3xl font-display mb-4 text-zinc-400">Cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn-premium btn-primary mt-4">Browse Collection</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-display font-light mb-8">Secure <span className="font-bold text-luxury-gold">Checkout</span></h1>
        
        <div className="bg-luxury-gold/10 border border-luxury-gold/20 p-4 mb-12 flex items-center gap-4">
          <Icons.Success className="text-luxury-gold w-6 h-6 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-luxury-gold">
            ১ টাকাও অগ্রিম ছাড়াই অর্ডার সম্পন্ন করুন! আমরা আপনার ঠিকানায় ক্যাশ অন ডেলিভারিতে প্রোডাক্ট পৌঁছে দেব।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-luxury-gold text-white flex items-center justify-center text-[10px]">1</span>
                Contact & Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">আপনার নাম (Full Name)</label>
                   <input 
                     required
                     type="text" 
                     placeholder="আপনার পূর্ণ নাম লিখুন"
                     className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold shadow-inner"
                     value={formData.fullName}
                     onChange={e => setFormData({...formData, fullName: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">মোবাইল নাম্বার (Phone Number)</label>
                   <input 
                     required
                     type="tel" 
                     placeholder="017XXXXXXXX"
                     className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold shadow-inner"
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">ইমেইল - ঐচ্ছিক (Email - Optional)</label>
                   <input 
                     type="email" 
                     placeholder="example@gmail.com"
                     className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold shadow-inner"
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                   />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">সম্পূর্ণ ঠিকানা (Full Delivery Address)</label>
                   <textarea 
                     required
                     rows={3}
                     placeholder="আপনার হাউজ নাম্বার, রোড নাম্বার এবং এরিয়া লিখুন"
                     className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold shadow-inner"
                     value={formData.address}
                     onChange={e => setFormData({...formData, address: e.target.value})}
                   ></textarea>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">শহর (City)</label>
                   <select 
                     className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold cursor-pointer"
                     value={formData.city}
                     onChange={e => setFormData({...formData, city: e.target.value})}
                   >
                     <option value="Dhaka">Dhaka (ঢাকা)</option>
                     <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                     <option value="Sylhet">Sylhet (সিলেট)</option>
                     <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                     <option value="Other">Other (অন্যান্য)</option>
                   </select>
                 </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-luxury-gold text-white flex items-center justify-center text-[10px]">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { id: 'cod', name: 'Cash on Delivery', icons: [<Icons.Success key="1" className="w-4 h-4"/>] },
                   { id: 'bkash', name: 'bKash / Nagad', icons: [<span key="1" className="text-[8px] font-black">MOBILE</span>] },
                 ].map(method => (
                   <label 
                     key={method.id}
                     className={`flex items-center justify-between p-6 border cursor-pointer transition-all ${
                       formData.paymentMethod === method.id 
                         ? 'border-luxury-gold bg-luxury-gold/5' 
                         : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                     }`}
                   >
                     <input 
                       type="radio" 
                       name="payment" 
                       className="hidden"
                       checked={formData.paymentMethod === method.id}
                       onChange={() => setFormData({...formData, paymentMethod: method.id})}
                     />
                     <div className="flex items-center gap-4">
                       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-luxury-gold' : 'border-zinc-300'}`}>
                         {formData.paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>}
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest">{method.name}</span>
                     </div>
                     <div className="flex items-center gap-2 text-zinc-400">
                       {method.icons}
                     </div>
                   </label>
                 ))}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 sticky top-32">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">Your Order</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.images[0]} alt="" className="w-16 h-16 object-cover border border-zinc-100 dark:border-zinc-800" />
                    <div className="flex-grow">
                      <h4 className="text-[10px] font-bold uppercase truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500">QTY: {item.quantity}</p>
                      <p className="text-[10px] font-bold">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 mb-8 text-[10px] uppercase tracking-widest">
                <div className="mb-6">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 mb-2 block">Promo Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="কুপন কোড (যদি থাকে)"
                      className="flex-grow bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 text-[10px] uppercase tracking-widest outline-none focus:border-luxury-gold"
                      value={formData.promoCode}
                      onChange={e => setFormData({...formData, promoCode: e.target.value})}
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyPromo}
                      className="px-4 bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase transition-colors hover:bg-luxury-gold hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-luxury-gold">
                    <span>Discount (5%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping Cost</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-luxury-black dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isOrdering}
                className="btn-premium btn-primary w-full disabled:opacity-50 py-5 text-sm"
              >
                {isOrdering ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার কনফার্ম করুন (Confirm Order)'}
              </button>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800">
                  <Icons.Success className="w-4 h-4 text-green-500" />
                  <span className="text-[9px] font-bold uppercase">ডেলিভারি ম্যানের সামনে চেক করে রিটার্ন সুবিধা</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800">
                  <Icons.Secure className="w-4 h-4 text-green-500" />
                  <span className="text-[9px] font-bold uppercase">১০০% অরিজিনাল কোয়ালিটি</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-black border border-zinc-100 dark:border-zinc-800">
                  <Icons.Delivery className="w-4 h-4 text-luxury-gold" />
                  <span className="text-[9px] font-bold uppercase">সারা বাংলাদেশে ফাস্ট ডেলিভারি</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};
