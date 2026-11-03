import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCartForWhatsApp,
  formatProductInquiryWhatsApp,
  createWhatsAppLink,
  DEFAULT_WHATSAPP_PHONE,
} from './whatsapp';
import { CartItem, Product } from '../types';

const sampleProd: Product = {
  id: 'p-1',
  name: 'Asian Paints Apex Ultima',
  category: 'Paints & Accessories',
  brand: 'Asian Paints',
  price: 5200,
  originalPrice: 5800,
  rating: 4.8,
  reviewsCount: 42,
  stock: 25,
  unit: '20L Bucket',
  image: '',
  images: [],
  description: 'Weatherproof exterior paint',
  specifications: {},
  features: [],
};

test('formatCartForWhatsApp prepares structured message with prices and items', () => {
  const items: CartItem[] = [{ product: sampleProd, quantity: 2 }];
  const message = formatCartForWhatsApp(items, 10400, 'Ramesh Builder');
  assert.ok(message.includes('Jyoti Hardware & Construction'));
  assert.ok(message.includes('Asian Paints Apex Ultima'));
  assert.ok(message.includes('Qty: 2 20L Bucket'));
  assert.ok(message.includes('₹10,400'));
});

test('createWhatsAppLink creates valid wa.me URL with phone number and encoded payload', () => {
  const link = createWhatsAppLink('Hello Jyoti Hardware', DEFAULT_WHATSAPP_PHONE);
  assert.ok(link.startsWith('https://wa.me/916297201943'));
  assert.ok(link.includes(encodeURIComponent('Hello Jyoti Hardware')));
});

test('formatProductInquiryWhatsApp includes product name, brand and rate', () => {
  const message = formatProductInquiryWhatsApp(sampleProd, 5);
  assert.ok(message.includes('Asian Paints Apex Ultima'));
  assert.ok(message.includes('Asian Paints'));
  assert.ok(message.includes('Quantity Needed: 5') || message.includes('*Quantity Needed:* 5'));
});
