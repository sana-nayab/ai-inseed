# Dylan Cafe Ordering System

A modern cafe ordering system built with React, TypeScript, and Supabase.

## Setup Instructions

1. **Connect to Supabase**: "Connect to Supabase
2. **Apply Database Migrations**: After connecting, the database tables will be automatically created
3. **Start Development**: Run `npm run dev` to start the development server

## Database Schema

The system uses the following tables:

- `categories`: Menu categories (Coffee, Tea, Smoothies, etc.)
- `dishes`: Individual menu items with pricing and descriptions
- `orders`: Customer orders with status tracking
- `order_items`: Line items for each order

## Features

- Real-time menu display from Supabase
- Shopping cart functionality
- Order status tracking
- Offline support with IndexedDB fallback
- Responsive design for mobile and desktop
- Queue number system for kitchen workflow

## Environment Variables

Copy `.env.example` to `.env` and update with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`
