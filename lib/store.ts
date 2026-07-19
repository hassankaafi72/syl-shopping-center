// In-memory data store — persists while the dev server is running.
// Initialised from the static seed data in data.ts.

import { PRODUCTS } from './data';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface StoredCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StoredProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  tag: string | null;
  featured: boolean;
  categoryId: string;
}

// ─── Seed categories ────────────────────────────────────────────────────────────
const initialCategories: StoredCategory[] = [
  { id: 'cat-cosmetics', name: 'Cosmetics & Beauty', slug: 'cosmetics-beauty' },
  { id: 'cat-groceries', name: 'Groceries & Food', slug: 'groceries-food' },
];

// ─── Seed products ──────────────────────────────────────────────────────────────
const initialProducts: StoredProduct[] = PRODUCTS.map((p) => {
  const catId = p.category === 'Cosmetics & Beauty' ? 'cat-cosmetics' : 'cat-groceries';
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    description: p.description,
    tag: p.tag ?? null,
    featured: p.featured ?? false,
    categoryId: catId,
  };
});

// ─── Live in-memory arrays ──────────────────────────────────────────────────────
let categories: StoredCategory[] = [...initialCategories];
let products: StoredProduct[] = [...initialProducts];

// ─── Category helpers ───────────────────────────────────────────────────────────
export function getAllCategories(): StoredCategory[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

export function addCategory(name: string): StoredCategory {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = categories.find((c) => c.slug === slug);
  if (existing) return existing;

  const cat: StoredCategory = { id: `cat-${Date.now()}`, name, slug };
  categories.push(cat);
  return cat;
}

export function updateCategory(id: string, name: string): StoredCategory | null {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return null;
  cat.name = name;
  cat.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return { ...cat };
}

export function deleteCategory(id: string): boolean {
  const hasProducts = products.some((p) => p.categoryId === id);
  if (hasProducts) return false; // prevent deleting categories that have products
  categories = categories.filter((c) => c.id !== id);
  return true;
}

// ─── Product helpers ────────────────────────────────────────────────────────────
export function getAllProducts() {
  return products
    .map((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      return {
        ...p,
        category: cat ? { ...cat } : { id: p.categoryId, name: 'Unknown', slug: 'unknown' },
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function addProductToStore(data: Omit<StoredProduct, 'id'>): StoredProduct {
  const product: StoredProduct = { id: `prod-${Date.now()}`, ...data };
  products.push(product);
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<StoredProduct, 'id'>>): StoredProduct | null {
  const product = products.find((p) => p.id === id);
  if (!product) return null;
  Object.assign(product, data);
  return { ...product };
}

export function deleteProductFromStore(id: string): boolean {
  const len = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < len;
}
