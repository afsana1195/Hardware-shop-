import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Building,
  Navigation,
} from 'lucide-react';
import { createWhatsAppLink } from '../utils/whatsapp';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Hardware Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;
    setIsSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = `*Hello Jyoti Hardware,*\nI am contacting you from your website regarding: ${formData.subject}\nName: ${formData.name || 'Site Client'}\nPhone: ${formData.phone || ''}\nMessage: ${formData.message || 'Need product availability and quotation.'}`;
    const link = createWhatsAppLink(text);
    window.open(link, '_blank');
  };

  return (
    <div className="bg-stone-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            <span>Bangalore Store &amp; Yard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Contact Jyoti Hardware &amp; Construction
          </h1>
          <p className="text-stone-500 text-sm">
            Reach out for cement trailer deliveries, power tool inquiries, or site contractor credit terms.
          </p>
        </div>

        {/* 2-Column: Left Info Cards & Map + Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-3">
                Store &amp; Yard Information
              </h2>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Working Address</div>
                    <div className="text-stone-600 mt-0.5 leading-relaxed">
                      Makali alur maine road, <br />
                      Pin code 562162, Bangalore, Karnataka.
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Contact Number</div>
                    <a
                      href="tel:6297201943"
                      className="text-emerald-700 font-bold hover:underline mt-0.5 block"
                    >
                      +91 6297201943 / 6297201943
                    </a>
                    <span className="text-[11px] text-stone-400">Available 7:30 AM to 8:30 PM</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Email Address</div>
                    <a
                      href="mailto:tantijoyti45@gmail.com"
                      className="text-sky-700 font-semibold hover:underline mt-0.5 block font-mono"
                    >
                      tantijoyti45@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">Operating Hours</div>
                    <div className="text-stone-600 mt-0.5">
                      Monday – Saturday: 7:30 AM – 8:30 PM <br />
                      Sunday: 8:00 AM – 2:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/916297201943?text=Hello%20Jyoti%20Hardware,%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Makali+alur+main+road+Bangalore+562162"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-red-600" />
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h2 className="text-base font-black text-stone-900 tracking-tight uppercase tracking-wider mb-1">
              Send an Instant Inquiry
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Our Makali desk will reply within 30 minutes during store hours.
            </p>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you for reaching out to Jyoti Hardware &amp; Construction. We have received your inquiry and our desk is preparing your reply.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        subject: 'General Hardware Inquiry',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs uppercase rounded-lg"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Builder"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9845012345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. contact@builder.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold focus:outline-none focus:bg-white focus:border-red-600 cursor-pointer"
                    >
                      <option value="Cement & Bulk Materials">Cement &amp; Bulk Materials</option>
                      <option value="Power Tools & Spares">Power Tools &amp; Spares</option>
                      <option value="Paints & Putty Quotation">Paints &amp; Putty Quotation</option>
                      <option value="Plumbing & CPVC Pipes">Plumbing &amp; CPVC Pipes</option>
                      <option value="Electrical Cables & Switches">Electrical Cables &amp; Switches</option>
                      <option value="Site Delivery Dispatch Status">Site Delivery Dispatch Status</option>
                      <option value="B2B Contractor Account">B2B Contractor Account</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details on quantities needed, site location in Bangalore, or desired delivery timing..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold focus:outline-none focus:bg-white focus:border-red-600"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Send on WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
