import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateCouponDiscount,
  calculateShippingFee,
  calculateOrderSummary,
  FREE_SHIPPING_THRESHOLD,
} from './cartCalculations';
import { Product, CartItem } from '../types';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'UltraTech Super Cement',
  category: 'Cement & Construction Materials',
  brand: 'UltraTech',
  price: 420,
  originalPrice: 460,
  rating: 4.9,
  reviewsCount: 154,
  stock: 100,
  unit: '50 kg Bag',
  image: '',
  images: [],
  description: 'Top grade cement',
  specifications: {},
  features: [],
  bulkDiscountTiers: [
    { minQty: 20, discountPercent: 5 },
    { minQty: 50, discountPercent: 10 },
  ],
};

const mockProductB: Product = {
  id: 'prod-2',
  name: 'Bosch Professional Impact Drill',
  category: 'Power Tools',
  brand: 'Bosch',
  price: 3499,
  originalPrice: 4200,
  rating: 4.8,
  reviewsCount: 88,
  stock: 12,
  unit: 'Piece',
  image: '',
  images: [],
  description: 'Heavy duty drill',
  specifications: {},
  features: [],
};

test('calculateItemTotal computes standard item price without tier discount', () => {
  const item: CartItem = { product: mockProductA, quantity: 5 };
  assert.equal(calculateItemTotal(item), 2100);
});

test('calculateItemTotal applies bulk tier discount when quantity exceeds threshold', () => {
  const item: CartItem = { product: mockProductA, quantity: 20 };
  // 5% off 420 is 399. 20 * 399 = 7980
  assert.equal(calculateItemTotal(item), 7980);
});

test('calculateSubtotal sums multiple cart items', () => {
  const items: CartItem[] = [
    { product: mockProductA, quantity: 2 }, // 840
    { product: mockProductB, quantity: 1 }, // 3499
  ];
  assert.equal(calculateSubtotal(items), 4339);
});

test('calculateCouponDiscount validates minimum spend and percent discount', () => {
  // BUILD10 has 10% off with minSpend 2000
  const underMin = calculateCouponDiscount('BUILD10', 1500);
  assert.equal(underMin.isValid, false);

  const valid = calculateCouponDiscount('BUILD10', 5000);
  assert.equal(valid.isValid, true);
  assert.equal(valid.discount, 500);
});

test('calculateShippingFee provides free shipping above threshold', () => {
  assert.equal(calculateShippingFee(5000, 'standard'), 450);
  assert.equal(calculateShippingFee(FREE_SHIPPING_THRESHOLD + 100, 'standard'), 0);
  assert.equal(calculateShippingFee(5000, 'pickup'), 0);
  assert.equal(calculateShippingFee(25000, 'express'), 850);
});

test('calculateOrderSummary calculates complete order breakdown with 18% GST', () => {
  const items: CartItem[] = [
    { product: mockProductA, quantity: 10 }, // 4200
  ];
  const summary = calculateOrderSummary(items, '', 'standard');
  assert.equal(summary.subtotal, 4200);
  assert.equal(summary.discount, 0);
  assert.equal(summary.tax, Math.round(4200 * 0.18)); // 756
  assert.equal(summary.shippingFee, 450);
  assert.equal(summary.total, 4200 + 756 + 450);
});
