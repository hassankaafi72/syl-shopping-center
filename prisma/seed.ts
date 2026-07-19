import { prisma } from '../lib/prisma';
import { PRODUCTS } from '../lib/data';

async function main() {
  console.log('Seeding database...');

  // Clear existing data to avoid duplicates
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Create categories
  const cosmeticsCategory = await prisma.category.create({
    data: {
      name: 'Cosmetics & Beauty',
      slug: 'cosmetics-beauty',
    },
  });

  const groceriesCategory = await prisma.category.create({
    data: {
      name: 'Groceries & Food',
      slug: 'groceries-food',
    },
  });

  console.log('Categories created successfully.');

  // 2. Create products and link to categories
  for (const item of PRODUCTS) {
    const categoryId = item.category === 'Cosmetics & Beauty' 
      ? cosmeticsCategory.id 
      : groceriesCategory.id;

    await prisma.product.create({
      data: {
        id: item.id, // Keep the same ID
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
        tag: item.tag || null,
        featured: item.featured ?? false,
        categoryId: categoryId,
      },
    });
  }

  console.log('Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
