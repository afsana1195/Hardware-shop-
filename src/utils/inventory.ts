import { Product, FilterState } from '../types';

export function getStockStatus(stock: number): {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  label: string;
  badgeClass: string;
  canOrder: boolean;
} {
  if (stock <= 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      badgeClass: 'bg-stone-100 text-stone-600 border border-stone-200',
      canOrder: false,
    };
  }
  if (stock <= 5) {
    return {
      status: 'low_stock',
      label: `Only ${stock} left`,
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      canOrder: true,
    };
  }
  return {
    status: 'in_stock',
    label: 'In Stock',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    canOrder: true,
  };
}

export function deductInventory(
  products: Product[],
  orderItems: { id: string; quantity: number }[]
): Product[] {
  return products.map((prod) => {
    const item = orderItems.find((i) => i.id === prod.id);
    if (!item) return prod;
    const newStock = Math.max(0, prod.stock - item.quantity);
    return {
      ...prod,
      stock: newStock,
    };
  });
}

export function filterAndSortProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  let result = [...products];

  // 1. Search query
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.features && p.features.some((f) => f.toLowerCase().includes(q)))
    );
  }

  // 2. Category
  if (filters.category && filters.category !== 'All') {
    result = result.filter((p) => p.category === filters.category);
  }

  // 3. Brands
  if (filters.brands && filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  // 4. Price range
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange;
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  }

  // 5. In stock only
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }

  // 6. Minimum Rating
  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  // 7. Sort By
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
      break;
    case 'newest':
      result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
      break;
    case 'popularity':
    default:
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.reviewsCount - a.reviewsCount);
      break;
  }

  return result;
}
