import { Product } from '../types';
import giftCardImg from '../assets/gift-card.jpeg';
import coffeeMugImg from '../assets/coffee-mug.jpeg';
import backpackImg from '../assets/backpack.jpeg';
import backpack2Img from '../assets/backpack-2.jpeg';
import featuredImg from '../assets/featured.jpeg';

export const products: Product[] = [
  {
    id: 'gift-card',
    image: giftCardImg,
    title: 'Gift Card',
    category: 'gift-cards',
    price: 25.00,
    featured: false
  },
  {
    id: 'coffee-mug',
    image: coffeeMugImg,
    title: 'Tin Coffee Tumbler',
    category: 'accessories',
    price: 35.00,
    featured: false
  },
  {
    id: 'blue-pack',
    image: backpackImg,
    title: 'Blue Canvas Pack',
    category: 'packs',
    price: 95.00,
    featured: false
  },
  {
    id: 'green-pack',
    image: backpack2Img,
    title: 'Green Canvas Pack',
    category: 'packs',
    price: 125.00,
    featured: false
  },
  {
    id: 'white-tent',
    image: featuredImg,
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
