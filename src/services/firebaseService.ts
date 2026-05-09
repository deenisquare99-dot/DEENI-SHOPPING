import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Category, Brand, Review } from '../types';

export const firebaseService = {
  // Reviews
  async getReviews(productId?: string) {
    const path = 'reviews';
    try {
      let q = query(collection(db, path), orderBy('createdAt', 'desc'));
      if (productId) {
        q = query(collection(db, path), where('productId', '==', productId), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const path = 'reviews';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...review,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Products
  async getProducts() {
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>) {
    const path = 'products';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...product,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const path = `products/${id}`;
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { ...product, updatedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(id: string) {
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Categories
  async getCategories() {
    const path = 'categories';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addCategory(category: Omit<Category, 'id'>) {
    const path = 'categories';
    try {
      const docRef = await addDoc(collection(db, path), category);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Brands
  async getBrands() {
    const path = 'brands';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addBrand(brand: Omit<Brand, 'id'>) {
    const path = 'brands';
    try {
      const docRef = await addDoc(collection(db, path), brand);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Orders
  async createOrder(orderData: any) {
    const path = 'orders';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...orderData,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getOrders() {
    const path = 'orders';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async deleteOrder(id: string) {
    const path = `orders/${id}`;
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getOrder(orderId: string) {
    const path = `orders/${orderId}`;
    try {
      const docRef = doc(db, 'orders', orderId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }
};
