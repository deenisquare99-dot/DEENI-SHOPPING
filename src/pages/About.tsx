import React from 'react';
import { motion } from 'motion/react';
import { Icons } from '../constants';

export const About = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-24">
          <span className="text-luxury-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-display font-light mb-12">Crafting <span className="font-bold text-luxury-gold">Moments</span> into Legacies.</h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Founded with a passion for exquisite timepieces, DEENI SHOPPING represents the intersection of timeless design and modern accessibility. We believe that true luxury shouldn't be a distant dream, but a daily companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1557597774-9d2739f85a94?w=1200" 
              alt="Brand Heritage" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-3xl font-display mb-8">আমাদের <span className="font-bold text-luxury-gold">গল্প</span></h2>
            <div className="space-y-8 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              <p>
                <span className="text-luxury-gold font-bold">দ্বীনি শপিং (DEENI SHOPPING)</span> শুধু একটি ব্যবসা নয়, এটি বিশ্বাস এবং আধুনিকতার এক মেলবন্ধন। আমরা বিশ্বাস করি একটি ভালো ঘড়ি শুধু সময় দেখায় না, এটি আপনার ব্যক্তিত্বের পরিচয় বহন করে।
              </p>
              <p>
                আমরা সরাসরি আমদানিকারকদের থেকে প্রিমিয়াম কোয়ালিটির ঘড়ি সংগ্রহ করি, যাতে আপনি পান সেরা পন্যটি সাশ্রয়ী মূল্যে। আমাদের প্রতিটি পণ্য যত্ন সহকারে যাচাই করা হয় যাতে গ্রাহক সন্তুষ্টি থাকে সবসময় শীর্ষে।
              </p>
              <p className="border-l-2 border-luxury-gold pl-6 italic">
                "স্বচ্ছতা এবং সততাই আমাদের এগিয়ে যাওয়ার মূল শক্তি। আমরা শুধুমাত্র একটি পণ্য আপনার হাতে পৌঁছে দিই না, বরং একটি দীর্ঘস্থায়ী সম্পর্ক গড়ার চেষ্টা করি।"
              </p>
            </div>
            <div className="space-y-6 mt-12">
              {[
                { title: "খাঁটি পণ্য (Originality)", icon: Icons.Secure, text: "আমরা ১০০% অরিজিনাল পন্যের নিশ্চয়তা প্রদান করি।" },
                { title: "নিপুণ কারুকার্য (Quality)", icon: Icons.Star, text: "প্রতিটি পন্যের মান খুব সুক্ষ্মভাবে যাচাই করা হয়।" },
                { title: "সেরা সেবা (Customer First)", icon: Icons.WhatsApp, text: "সরাসরি হোয়াটসঅ্যাপে দ্রুত কাস্টমার সাপোর্ট পাবেন।" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 shrink-0 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-xs text-zinc-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center py-24 border-t border-zinc-100 dark:border-zinc-800">
           <h2 className="text-3xl font-display mb-12">Global <span className="font-bold">Trust</span></h2>
           <div className="flex flex-wrap justify-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-bold font-display uppercase tracking-widest">Prestige</span>
              <span className="text-2xl font-bold font-display uppercase tracking-widest">Heritage</span>
              <span className="text-2xl font-bold font-display uppercase tracking-widest">Legacy</span>
              <span className="text-2xl font-bold font-display uppercase tracking-widest">Essence</span>
           </div>
        </div>
      </div>
    </div>
  );
};
