import React from 'react';
import { Icons } from '../constants';
import { firebaseService } from '../services/firebaseService';

export const SupportPages = {
  FAQ: () => (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-display mb-12">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {[
          { q: "How long does delivery take?", a: "Inside Dhaka, we deliver within 24-48 hours. Outside Dhaka, it takes 2-4 business days." },
          { q: "Do you have Cash on Delivery?", a: "Yes, we provide Cash on Delivery all over Bangladesh." },
          { q: "Are your watches original?", a: "Absolutely. We pride ourselves on sourcing only 100% authentic premium brands." },
          { q: "What is your return policy?", a: "ডেলিভারি ম্যানের সামনে প্রোডাক্ট চেক করে পছন্দ না হলে সাথে সাথে রিটার্ন করতে পারবেন।" }
        ].map((item, i) => (
          <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3">{item.q}</h3>
            <p className="text-sm text-zinc-500">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  OrderTracking: () => {
    const [orderIdInput, setOrderIdInput] = React.useState('');
    const [phoneInput, setPhoneInput] = React.useState('');
    const [order, setOrder] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleTrack = async () => {
      if (!orderIdInput || !phoneInput) {
        setError('দয়া করে অর্ডার আইডি এবং ফোন নম্বর দিন।');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const foundOrder = await firebaseService.getOrder(orderIdInput) as any;
        if (foundOrder && foundOrder.phone === phoneInput) {
          setOrder(foundOrder);
        } else {
          setError('আপনার দেওয়া তথ্য সঠিক নয়। আবার চেষ্টা করুন।');
          setOrder(null);
        }
      } catch (err) {
        setError('অর্ডার খুজে পেতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="pt-48 pb-32 max-w-xl mx-auto px-6 text-center">
        <Icons.Delivery className="w-12 h-12 mx-auto mb-8 text-luxury-gold" />
        <h1 className="text-3xl font-display mb-6">Track Your Order</h1>
        {!order ? (
          <>
            <p className="text-zinc-500 mb-10 text-sm">অর্ডারের অবস্থা জানতে নিচের তথ্যগুলো দিন।</p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Order ID" 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold" 
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
              />
              {error && <p className="text-red-500 text-[10px] uppercase font-bold">{error}</p>}
              <button 
                onClick={handleTrack}
                disabled={loading}
                className="btn-premium btn-primary w-full"
              >
                {loading ? 'প্রসেসিং...' : 'Track Order (অর্ডার ট্র্যাক করুন)'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-left bg-zinc-50 dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                <p className="text-xl font-bold text-luxury-gold uppercase tracking-tighter">{order.status}</p>
              </div>
              <button onClick={() => setOrder(null)} className="text-[10px] uppercase underline text-zinc-400">নতুন ভাবে খুঁজুন</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Customer</p>
                <p className="text-sm font-bold">{order.customerName}</p>
                <p className="text-xs text-zinc-400">{order.address}, {order.city}</p>
              </div>
              
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Order Details</p>
                <div className="space-y-2 mt-2">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-zinc-600">{item.name} x {item.quantity}</span>
                      <span className="font-bold">{item.price * item.quantity} TK</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold">Total Amount</span>
                <span className="text-lg font-bold text-luxury-gold">{order.total} TK</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  Privacy: () => (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-6">
      <h1 className="text-4xl font-display mb-12">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-zinc-500 space-y-6">
        <p>At DEENI SHOPPING, we are committed to protecting your privacy and ensuring your personal information is handled securely.</p>
        <h3 className="text-zinc-900 dark:text-white font-bold">Data Collection</h3>
        <p>We collect information such as your name, phone number, and address only for the purpose of fulfilling your orders correctly.</p>
        <h3 className="text-zinc-900 dark:text-white font-bold">Security</h3>
        <p>Your data is encrypted and we do not store sensitive payment information like credit card numbers directly on our servers.</p>
      </div>
    </div>
  )
};
