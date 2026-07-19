'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';

// Memory cache for rate limiting: IP -> timestamps of requests within the last minute
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  // Get timestamps for this IP
  let timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps older than one minute
  timestamps = timestamps.filter(t => t > oneMinuteAgo);
  
  if (timestamps.length >= 5) {
    return false; // Rate limit exceeded (more than 5 requests per minute)
  }
  
  // Add current timestamp and update map
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function addProduct(data: {
  name: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
  featured?: boolean;
  categoryId: string;
}) {
  // 1. Authentication check via Server-side Cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('syl-admin-session')?.value;
  if (session !== 'active') {
    console.warn('Unauthorized addProduct attempt');
    return { success: false, error: 'Unauthorized' };
  }

  // 2. IP-based Rate Limiter (Max 5 operations per minute per IP)
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return { success: false, error: 'Too many requests. Please wait one minute.' };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
        tag: data.tag || null,
        featured: data.featured ?? false,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });
    
    revalidatePath('/');
    revalidatePath('/products');
    return { success: true, product };
  } catch (error) {
    console.error('Failed to add product:', error);
    return { success: false, error: 'Failed to add product to database' };
  }
}

export async function deleteProduct(id: string) {
  // 1. Authentication check via Server-side Cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('syl-admin-session')?.value;
  if (session !== 'active') {
    console.warn('Unauthorized deleteProduct attempt');
    return { success: false, error: 'Unauthorized' };
  }

  // 2. IP-based Rate Limiter (Max 5 operations per minute per IP)
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return { success: false, error: 'Too many requests. Please wait one minute.' };
  }

  try {
    await prisma.product.delete({
      where: { id },
    });
    
    revalidatePath('/');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, error: 'Failed to delete product from database' };
  }
}
