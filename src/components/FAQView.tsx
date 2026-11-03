import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Where do you deliver across Bangalore and Karnataka?',
    a: 'We deliver directly to project sites throughout Bangalore, including Makali, Alur, Nelamangala, Peenya, Yeshwanthpur, Dasarahalli, Rajajinagar, Tumkur Road, and Greater Bangalore. For bulk trailer loads of cement and structural steel, we deliver across all Karnataka districts.',
  },
  {
    q: 'What is the minimum order value for free site delivery?',
    a: 'Orders above ₹15,000 qualify for FREE standard site delivery across our immediate Bangalore delivery zones. For orders below ₹15,000, a nominal shipping charge of ₹450 is applied, or you may choose free self-pickup at our Makali Yard.',
  },
  {
    q: 'Are all products authentic with manufacturer warranties?',
    a: 'Yes, 100%. Jyoti Hardware & Construction is an authorized direct dealer for UltraTech, Tata Tiscon, Bosch, Asian Paints, Havells, Supreme CPVC, and Pidilite. All power tools come with original manufacturer warranty cards and tax invoices.',
  },
  {
    q: 'Can I get a formal GST invoice to claim input tax credit (ITC)?',
    a: 'Yes! Simply check the "I need a GST Tax Invoice" box during checkout and enter your company name and 15-character GSTIN. Your printed and downloadable tax invoice will clearly itemize the 18% / 28% GST breakdown for your accountant.',
  },
  {
    q: 'How does payment work? Can I pay on delivery?',
    a: 'We accept payments through our secure Razorpay gateway (UPI via Google Pay, PhonePe, Paytm, BHIM, QR code, debit/credit cards, and net banking). We also offer Pay on Site Delivery (Cash on Delivery) so you can inspect material at your construction site before paying.',
  },
  {
    q: 'Can I order directly through WhatsApp?',
    a: 'Yes! Every product, your shopping cart, and our bulk quote tool have a dedicated "Order on WhatsApp" button that automatically creates a structured WhatsApp message with products, quantities, prices, and totals sent directly to our business number (+91 6297201943).',
  },
  {
    q: 'What is the return policy if excess bags of cement or pipes are unopened?',
    a: 'Standard non-perishable hardware (power tools in unopened packaging, unbent pipes, intact hardware accessories) can be returned within 7 days with original tax invoice. For cement bags, returns are subject to moisture inspection within 48 hours of delivery.',
  },
];

export const FAQView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-stone-100 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Customer Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-500 text-sm max-w-lg mx-auto">
            Everything you need to know about placing hardware orders, site unloading, GST invoices, and delivery schedules.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-stone-900 text-sm hover:text-red-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center space-y-3 shadow-xs">
          <h3 className="font-bold text-stone-900 text-sm">Have a custom structural inquiry?</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Our Makali yard team is available Monday to Saturday to calculate bill-of-materials and project quantities.
          </p>
          <a
            href="tel:6297201943"
            className="inline-block px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            Call Us: +91 6297201943
          </a>
        </div>
      </div>
    </div>
  );
};
