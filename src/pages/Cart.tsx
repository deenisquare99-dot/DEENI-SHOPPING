import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Icons } from '../constants';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-32 text-center">
        <Icons.Cart className="w-16 h-16 mx-auto mb-8 text-zinc-300" />
        <h2 className="text-3xl font-display mb-4">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Explore our collection and find the perfect timepiece for your collection.</p>
        <Link to="/shop" className="btn-premium btn-primary inline-flex">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-display font-light mb-16">Your <span className="font-bold">Cart</span></h1>
        
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <div className="border-t border-zinc-100 dark:border-zinc-800">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-8 py-8 border-b border-zinc-100 dark:border-zinc-800">
                  <Link to={`/product/${item.id}`} className="w-32 aspect-square bg-zinc-50 dark:bg-zinc-900 overflow-hidden shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </Link>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{item.name}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase mb-4">{item.category}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-luxury-gold transition-colors"
                      >
                        <Icons.Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-luxury-gold transition-colors"
                      >
                        <Icons.Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-center sm:items-end gap-4 min-w-[120px]">
                    <span className="text-sm font-bold">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-luxury-gold transition-colors">
                <Icons.ArrowLeft className="w-3 h-3" /> Continue Shopping
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span className="text-zinc-500">Subtotal ({totalItems} items)</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-wider">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-luxury-gold font-bold">Calculated at next step</span>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mb-8 flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold font-display">{formatPrice(totalPrice)}</span>
              </div>

              <Link to="/checkout" className="btn-premium btn-primary w-full flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-[0.1em]">
                PROCEED TO CHECKOUT
              </Link>
              
              <p className="mt-6 text-[10px] text-zinc-400 text-center uppercase tracking-widest">
                Fast Delivery all over Bangladesh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
