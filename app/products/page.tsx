import React from 'react';
import ProductsClient from '@/components/products-client';
import { getProducts, getCategories } from '@/app/actions/products';

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  return <ProductsClient initialProducts={products} initialCategories={categories} />;
}
