import React from 'react';
import AdminClient from '@/components/admin-client';
import { getProducts, getCategories } from '@/app/actions/products';

export const revalidate = 0;

export default async function AdminPage() {
  const products = await getProducts();
  const categories = await getCategories();
  return <AdminClient initialProducts={products} initialCategories={categories} />;
}
