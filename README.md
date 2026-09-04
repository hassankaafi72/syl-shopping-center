# SYL Shopping Center

A Next.js catalogue website for cosmetics, beauty products, and groceries. Visitors can browse products, manage a local cart, contact the seller through WhatsApp, and open a WhatsApp order message.

## Features

1. Product listing and category filtering.
2. Featured product display, product search, and product detail views.
3. Cart stored in the visitor's browser through Zustand persistence.
4. WhatsApp links for product orders and contact form messages.
5. Prisma backed product and category data, with a seed script for the initial catalogue.
6. An admin interface that can add, delete, and upload product images.

## Technology

The application uses Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Zustand, Framer Motion, and Lucide React.

## Project Structure

1. `app` contains pages, server actions, and the image upload route.
2. `components` contains the public shop and admin interface components.
3. `prisma` contains the database schema and catalogue seed script.
4. `store` contains the browser cart state.
5. `public/uploads` holds a committed product image.

## Run Locally

Node.js, npm, and a PostgreSQL database are required. Configure `DATABASE_URL` for the application and `DIRECT_URL` for Prisma, then install dependencies, generate the client, seed the database, and start the server.

```bash
npm install
npm run postinstall
npx prisma db seed
npm run dev
```

Create a production build with `npm run build`, start it with `npm run start`, and run linting with `npm run lint`.

## Current Limitations

Orders and contact messages are prepared in the browser and opened in WhatsApp; this project has no checkout, payment processing, order database, or delivery workflow. The current admin page contains demo credentials in client code and uses a client writable cookie for server actions. It must not be treated as secure authentication before deployment. Uploaded files are written to the local application filesystem, which may not persist on serverless hosts.
