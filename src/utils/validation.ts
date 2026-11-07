/**
 * Validation utilities for Shakthi / Jyoti Hardware Store
 */

export function cleanIndianPhone(val: string): string {
  if (!val) return '';
  // Remove non-digit chars and strip optional leading +91 / 91 / 0
  const digits = val.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits.slice(-10);
}

export function validateIndianPhone(val: string): boolean {
  const cleaned = cleanIndianPhone(val);
  // Valid Indian mobile numbers are 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function validateEmail(val: string): boolean {
  if (!val || !val.trim()) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

export interface BulkOrderValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateBulkOrderForm(formData: {
  customerName: string;
  phone: string;
  email?: string;
  productName: string;
  quantity: string;
}): BulkOrderValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.customerName || formData.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your contractor, firm, or personal name.';
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Mobile number is required for WhatsApp quote dispatch.';
  } else if (!validateIndianPhone(formData.phone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
  }

  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address or leave blank.';
  }

  if (!formData.productName || !formData.productName.trim()) {
    errors.productName = 'Please specify the material or equipment needed.';
  }

  if (!formData.quantity || !formData.quantity.trim()) {
    errors.quantity = 'Please specify the approximate quantity required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
