import React from 'react';
import HomeClient from '@/components/home-client';
import { getProducts } from '@/app/actions/products';

export const revalidate = 0;

export default async function Home() {
  const products = await getProducts();
  return <HomeClient initialProducts={products} />;
}
