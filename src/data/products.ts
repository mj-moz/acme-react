import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'gift-card',
    image: './assets/gift-card.jpeg',
    title: 'Gift Card',
    category: 'gift-cards',
    price: 25.00,
    featured: false
  },
  {
    id: 'coffee-mug',
    image: './assets/coffee-mug.jpeg',
    title: 'Tin Coffee Tumbler',
    category: 'accessories',
    price: 35.00,
    featured: false
  },
  {
    id: 'blue-pack',
    image: './assets/backpack.jpeg',
    title: 'Blue Canvas Pack',
    category: 'packs',
    price: 95.00,
    featured: false
  },
  {
    id: 'green-pack',
    image: './assets/backpack-2.jpeg',
    title: 'Green Canvas Pack',
    category: 'packs',
    price: 125.00,
    featured: false
  },
  {
    id: 'white-tent',
    image: './assets/featured.jpeg',
    title: 'White Tent',
    category: 'tents',
    price: 125.00,
    featured: true
  }
];

export const categories = [
  { id: 'all-products', name: 'All Products' },
  { id: 'tents', name: 'Tents' },
  { id: 'packs', name: 'Packs' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'gift-cards', name: 'Gift Cards' }
];
