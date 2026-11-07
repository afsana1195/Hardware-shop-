import test from 'node:test';
import assert from 'node:assert';
import {
  cleanIndianPhone,
  validateIndianPhone,
  validateEmail,
  validateBulkOrderForm,
} from './validation';

test('cleanIndianPhone normalizes various Indian phone formats', () => {
  assert.strictEqual(cleanIndianPhone('9845012345'), '9845012345');
  assert.strictEqual(cleanIndianPhone('+91 9845012345'), '9845012345');
  assert.strictEqual(cleanIndianPhone('09845012345'), '9845012345');
  assert.strictEqual(cleanIndianPhone('91-98450-12345'), '9845012345');
  assert.strictEqual(cleanIndianPhone('+91 (98450) 12345'), '9845012345');
});

test('validateIndianPhone checks for valid 10-digit mobile prefix (6,7,8,9)', () => {
  assert.strictEqual(validateIndianPhone('9845012345'), true);
  assert.strictEqual(validateIndianPhone('8765432109'), true);
  assert.strictEqual(validateIndianPhone('7012345678'), true);
  assert.strictEqual(validateIndianPhone('6297201943'), true);
  assert.strictEqual(validateIndianPhone('+91 9845012345'), true);

  // Invalid numbers
  assert.strictEqual(validateIndianPhone('1234567890'), false); // Starts with 1
  assert.strictEqual(validateIndianPhone('5555555555'), false); // Starts with 5
  assert.strictEqual(validateIndianPhone('9845012'), false); // Less than 10 digits
  assert.strictEqual(validateIndianPhone(''), false);
});

test('validateEmail checks standard email patterns', () => {
  assert.strictEqual(validateEmail(''), true); // optional
  assert.strictEqual(validateEmail('test@example.com'), true);
  assert.strictEqual(validateEmail('ramesh.kumar@skbuilders.in'), true);
  assert.strictEqual(validateEmail('invalid-email'), false);
  assert.strictEqual(validateEmail('missing@dot'), false);
});

test('validateBulkOrderForm requires name, phone, material, and quantity', () => {
  const valid = validateBulkOrderForm({
    customerName: 'Ramesh Builders',
    phone: '9845012345',
    email: 'ramesh@skbuilders.com',
    productName: 'UltraTech PPC Cement',
    quantity: '200 Bags',
  });
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(Object.keys(valid.errors).length, 0);

  const invalid = validateBulkOrderForm({
    customerName: '',
    phone: '12345',
    email: 'bad-email',
    productName: '',
    quantity: '',
  });
  assert.strictEqual(invalid.isValid, false);
  assert.ok(invalid.errors.customerName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.productName);
  assert.ok(invalid.errors.quantity);
});
