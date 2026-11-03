import { CartItem, DeliveryMethod } from '../types';

export const TAX_RATE = 0.18; // 18% GST standard on hardware
export const FREE_SHIPPING_THRESHOLD = 15000;
export const STANDARD_SHIPPING_FEE = 450;
export const EXPRESS_SHIPPING_FEE = 850;

export const AVAILABLE_COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; minSpend: number; description: string }> = {
  BUILD10: {
    type: 'percent',
    value: 10,
    minSpend: 2000,
    description: '10% OFF on construction and hardware materials (Min spend ₹2,000)',
  },
  JYOTI500: {
    type: 'flat',
    value: 500,
    minSpend: 5000,
    description: 'Flat ₹500 OFF on orders above ₹5,000',
  },
  SUPERBUILD: {
    type: 'percent',
    value: 15,
    minSpend: 25000,
    description: '15% Mega Discount for Site Projects (Min spend ₹25,000)',
  },
};

export function calculateItemTotal(item: CartItem): number {
  let unitPrice = item.product.price;
  // Check bulk discount tiers if applicable
  if (item.product.bulkDiscountTiers && item.product.bulkDiscountTiers.length > 0) {
    const applicableTier = [...item.product.bulkDiscountTiers]
      .sort((a, b) => b.minQty - a.minQty)
      .find((tier) => item.quantity >= tier.minQty);
    if (applicableTier) {
      unitPrice = unitPrice * (1 - applicableTier.discountPercent / 100);
    }
  }
  return Math.round(unitPrice * item.quantity);
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
}

export function calculateCouponDiscount(
  code: string,
  subtotal: number
): { discount: number; isValid: boolean; message: string } {
  if (!code || !code.trim()) {
    return { discount: 0, isValid: false, message: '' };
  }
  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS[normalized];

  if (!coupon) {
    return { discount: 0, isValid: false, message: 'Invalid promo code. Try BUILD10 or JYOTI500' };
  }

  if (subtotal < coupon.minSpend) {
    return {
      discount: 0,
      isValid: false,
      message: `Coupon requires minimum order of ₹${coupon.minSpend.toLocaleString('en-IN')}`,
    };
  }

  let discount = 0;
  if (coupon.type === 'percent') {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }

  return {
    discount,
    isValid: true,
    message: `Applied ${normalized}: ${coupon.description}`,
  };
}

export function calculateShippingFee(subtotal: number, deliveryMethod: DeliveryMethod): number {
  if (deliveryMethod === 'pickup') {
    return 0;
  }
  if (deliveryMethod === 'express') {
    return EXPRESS_SHIPPING_FEE;
  }
  // Standard delivery
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_FEE;
}

export function calculateOrderSummary(
  items: CartItem[],
  couponCode: string = '',
  deliveryMethod: DeliveryMethod = 'standard'
) {
  const subtotal = calculateSubtotal(items);
  const couponResult = calculateCouponDiscount(couponCode, subtotal);
  const discount = couponResult.isValid ? couponResult.discount : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  // GST 18% included or added (in Indian hardware e-commerce, display tax itemized clearly)
  const tax = Math.round(taxableAmount * TAX_RATE);
  const shippingFee = items.length === 0 ? 0 : calculateShippingFee(subtotal, deliveryMethod);
  const total = taxableAmount + tax + shippingFee;

  return {
    subtotal,
    discount,
    couponMessage: couponResult.message,
    isCouponValid: couponResult.isValid,
    tax,
    shippingFee,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
