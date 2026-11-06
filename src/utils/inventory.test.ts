import test from 'node:test';
import assert from 'node:assert/strict';
import { getStockStatus, deductInventory, filterAndSortProducts } from './inventory';
import { Product, FilterState } from '../types';

const testProducts: Product[] = [
  {
    id: 'p1',
    name: 'Bosch Impact Drill GSB 600',
    category: 'Power Tools',
    brand: 'Bosch',
    price: 3499,
    originalPrice: 4200,
    rating: 4.8,
    reviewsCount: 120,
    stock: 15,
    unit: 'Piece',
    image: '',
    images: [],
    description: 'Drill machine',
    specifications: {},
    features: ['600W power'],
    isFeatured: true,
  },
  {
    id: 'p2',
    name: 'Supreme CPVC Pipe 1 inch',
    category: 'Plumbing Supplies',
    brand: 'Supreme',
    price: 380,
    originalPrice: 450,
    rating: 4.5,
    reviewsCount: 35,
    stock: 3,
    unit: '3m Length',
    image: '',
    images: [],
    description: 'CPVC pipe',
    specifications: {},
    features: ['SDR 11'],
  },
  {
    id: 'p3',
    name: 'Tata Tiscon 12mm TMT Bar',
    category: 'Cement & Construction Materials',
    brand: 'Tata Tiscon',
    price: 680,
    originalPrice: 720,
    rating: 4.9,
    reviewsCount: 95,
    stock: 0,
    unit: 'Bar',
    image: '',
    images: [],
    description: 'Steel rebar',
    specifications: {},
    features: ['Fe 550D'],
  },
];

test('getStockStatus identifies out_of_stock, low_stock, and in_stock', () => {
  assert.equal(getStockStatus(0).status, 'out_of_stock');
  assert.equal(getStockStatus(0).canOrder, false);

  assert.equal(getStockStatus(3).status, 'low_stock');
  assert.equal(getStockStatus(3).canOrder, true);

  assert.equal(getStockStatus(20).status, 'in_stock');
  assert.equal(getStockStatus(20).canOrder, true);
});

test('deductInventory subtracts ordered quantity and never drops below zero', () => {
  const updated = deductInventory(testProducts, [
    { id: 'p1', quantity: 5 },
    { id: 'p2', quantity: 10 },
  ]);
  const p1 = updated.find((p) => p.id === 'p1');
  const p2 = updated.find((p) => p.id === 'p2');
  assert.equal(p1?.stock, 10);
  assert.equal(p2?.stock, 0); // clamped at 0
});

test('filterAndSortProducts correctly filters by category and search keyword', () => {
  const defaultFilters: FilterState = {
    search: 'drill',
    category: 'All',
    brands: [],
    priceRange: [0, 100000],
    inStockOnly: false,
    minRating: 0,
    sortBy: 'popularity',
  };

  const results = filterAndSortProducts(testProducts, defaultFilters);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'p1');
});

test('filterAndSortProducts sorts by price-asc and price-desc', () => {
  const ascFilters: FilterState = {
    search: '',
    category: 'All',
    brands: [],
    priceRange: [0, 100000],
    inStockOnly: false,
    minRating: 0,
    sortBy: 'price-asc',
  };
  const ascResults = filterAndSortProducts(testProducts, ascFilters);
  assert.equal(ascResults[0].price <= ascResults[1].price, true);
  assert.equal(ascResults[1].price <= ascResults[2].price, true);

  const descFilters: FilterState = {
    ...ascFilters,
    sortBy: 'price-desc',
  };
  const descResults = filterAndSortProducts(testProducts, descFilters);
  assert.equal(descResults[0].price >= descResults[1].price, true);
  assert.equal(descResults[1].price >= descResults[2].price, true);
});

