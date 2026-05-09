import React from 'react';
import { Icons } from '../constants';

export const Contact = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-24">
          <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block">Get In Touch</span>
          <h1 className="text-5xl font-display font-light">We're here to <span className="font-bold">Assist You.</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Contact Channels</h3>
              <div className="space-y-6">
                <a 
                  href="https://wa.me/8801629232000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-6 border border-zinc-100 dark:border-zinc-800 hover:border-luxury-gold transition-colors group"
                >
                  <Icons.WhatsApp className="w-6 h-6 text-[#25D366]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">WhatsApp Support</p>
                    <p className="text-lg font-display">01629-232000</p>
                  </div>
                </a>
                <div className="flex items-center gap-6 p-6 border border-zinc-100 dark:border-zinc-800">
                  <Icons.Send className="w-6 h-6 text-luxury-gold" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Email Inquiries</p>
                    <p className="text-lg font-display">support@deenishopping.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Operating Hours</h3>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-transparent">
                 <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-800">
                   <span className="text-xs uppercase tracking-widest text-zinc-500">Saturday - Thursday</span>
                   <span className="text-xs font-bold">10:00 AM - 10:00 PM</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                   <span className="text-xs uppercase tracking-widest text-zinc-500">Friday</span>
                   <span className="text-xs font-bold">03:00 PM - 10:00 PM</span>
                 </div>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Send a Message</h3>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Name</label>
                    <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Email</label>
                    <input type="email" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Subject</label>
                  <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Message</label>
                  <textarea rows={6} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-xs outline-none focus:border-luxury-gold"></textarea>
                </div>
                <button type="submit" className="btn-premium btn-primary w-full">Send Inquiry</button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};
