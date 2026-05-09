import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';
import { Icons } from '../constants';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="luxury-card group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-luxury-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <div
            className="px-6 py-2 bg-white text-luxury-black text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            Show Details
          </div>
        </div>
      </Link>

      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">{product.category.replace('-', ' ')}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 group-hover:text-luxury-gold transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mb-6">
          {product.discountPrice ? (
            <>
              <span className="text-sm font-bold text-luxury-gold">{formatPrice(product.discountPrice)}</span>
              <span className="text-xs text-zinc-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
          )}
        </div>

        <button
          onClick={handleOrder}
          className="w-full bg-luxury-gold text-luxury-black py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all duration-500 shadow-xl"
        >
           ORDER NOW
        </button>
      </div>
    </motion.div>
  );
};
