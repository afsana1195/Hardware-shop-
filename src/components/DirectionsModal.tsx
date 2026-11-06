import React from 'react';
import { X, MapPin, Navigation, Phone, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import { STORE_NAME, STORE_ADDRESS, DEFAULT_WHATSAPP_PHONE } from '../utils/whatsapp';

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Jyoti Hardware & Construction, Makali Alur Main Road, Bangalore 562162'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#0c432d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Visit Our Hardware Store</h3>
              <p className="text-emerald-100 text-xs">{STORE_NAME}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storefront Image */}
        <div className="relative h-44 bg-stone-900 overflow-hidden">
          <img
            src="/assets/reference/store_banner.png"
            alt="Jyoti Hardware & Construction Storefront"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Main Retail &amp; Loading Yard
              </span>
              <h4 className="text-sm font-black">Makali – Alur Main Road, Bangalore</h4>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Complete Address:</strong>
                <span>{STORE_ADDRESS}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong className="text-stone-900">Store Timings:</strong> Mon – Sat: 7:30 AM – 8:30 PM | Sun: 8:00 AM – 2:00 PM
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-stone-900">Yard Dispatch Desk:</strong>{' '}
                <a href="tel:6297201943" className="font-bold text-[#0c432d] hover:underline">
                  +91 6297201943
                </a>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-[#0c432d] hover:bg-[#083020] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>

            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(
                'Hello Jyoti Hardware, please share the GPS location and yard directions for Makali Alur road.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Location</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
