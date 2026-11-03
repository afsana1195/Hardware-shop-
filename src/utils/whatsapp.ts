import { Order, Product, CartItem, BulkQuoteRequest } from '../types';

export const DEFAULT_WHATSAPP_PHONE = '916297201943';
export const STORE_NAME = 'Jyoti Hardware & Construction';
export const STORE_ADDRESS = 'Makali alur maine road, Pin code 562162, Bangalore, Karnataka';

export function formatCartForWhatsApp(items: CartItem[], total: number, customerName?: string): string {
  const lines: string[] = [
    `*⚡ NEW ORDER ENQUIRY - ${STORE_NAME}*`,
    `📍 Store: ${STORE_ADDRESS}`,
    customerName ? `👤 *Customer:* ${customerName}` : '',
    '',
    '*📋 Ordered Items:*',
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.product.name}* (${item.product.brand})`,
      `   Qty: ${item.quantity} ${item.product.unit || 'unit(s)'} x ₹${item.product.price.toLocaleString('en-IN')}`,
      `   Item Total: ₹${(item.quantity * item.product.price).toLocaleString('en-IN')}`
    );
  });

  lines.push('');
  lines.push(`*💰 Estimated Total:* ₹${total.toLocaleString('en-IN')}`);
  lines.push('');
  lines.push('Please confirm availability and earliest delivery to our site/address. Thank you!');

  return lines.filter((l) => l !== '').join('\n');
}

export function formatOrderConfirmationWhatsApp(order: Order): string {
  const lines: string[] = [
    `*✅ CONFIRMED ORDER #${order.id}*`,
    `*${STORE_NAME}*`,
    `📅 Date: ${order.date}`,
    '',
    `*👤 Customer Details:*`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    `Delivery Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pinCode}`,
    order.customer.landmark ? `Landmark: ${order.customer.landmark}` : '',
    order.customer.gstNumber ? `GSTIN: ${order.customer.gstNumber}` : '',
    '',
    `*📦 Ordered Items:*`,
  ];

  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.product.name} [${item.product.brand}]`,
      `   Qty: ${item.quantity} | Rate: ₹${item.product.price.toLocaleString('en-IN')} | ₹${(item.quantity * item.product.price).toLocaleString('en-IN')}`
    );
  });

  lines.push('');
  lines.push(`Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}`);
  if (order.discount > 0) lines.push(`Discount: -₹${order.discount.toLocaleString('en-IN')}`);
  lines.push(`GST (18%): ₹${order.tax.toLocaleString('en-IN')}`);
  lines.push(`Shipping: ${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toLocaleString('en-IN')}`}`);
  lines.push(`*Grand Total: ₹${order.total.toLocaleString('en-IN')}*`);
  lines.push(`Payment Method: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})`);
  lines.push(`Delivery Method: ${order.deliveryMethod.toUpperCase()}`);
  lines.push('');
  lines.push('Please send tracking details and driver contact once loaded.');

  return lines.filter((l) => l !== '').join('\n');
}

export function formatProductInquiryWhatsApp(product: Product, quantity: number = 1): string {
  return [
    `*Hello ${STORE_NAME},*`,
    `I am interested in ordering:`,
    `*Product:* ${product.name}`,
    `*Brand:* ${product.brand}`,
    `*Category:* ${product.category}`,
    `*Price:* ₹${product.price.toLocaleString('en-IN')} / ${product.unit}`,
    `*Quantity Needed:* ${quantity}`,
    '',
    `Do you deliver to Bangalore (Pin: 562162 / nearby site)? Please share current stock & quotation.`,
  ].join('\n');
}

export function formatBulkQuoteWhatsApp(quote: BulkQuoteRequest): string {
  return [
    `*🏗️ BULK PROJECT QUOTATION REQUEST*`,
    `*${STORE_NAME}*`,
    `Ref ID: ${quote.id}`,
    '',
    `*Client Name:* ${quote.customerName}`,
    `*Phone:* ${quote.phone}`,
    `*Email:* ${quote.email}`,
    `*Material Required:* ${quote.productName}`,
    `*Estimated Quantity:* ${quote.quantity}`,
    `*Delivery Site Location:* ${quote.deliveryLocation}`,
    quote.notes ? `*Project Details/Notes:* ${quote.notes}` : '',
    '',
    `Please provide wholesale contractor pricing and credit/delivery terms.`,
  ].filter(Boolean).join('\n');
}

export function createWhatsAppLink(message: string, phoneNumber: string = DEFAULT_WHATSAPP_PHONE): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
