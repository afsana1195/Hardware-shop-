import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Smartphone,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  orderDraft: any;
  onPaymentSuccess: (paymentId: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  orderDraft,
  onPaymentSuccess,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPayId = `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setIsProcessing(false);
      onPaymentSuccess(generatedPayId);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Authentic Razorpay Dark Blue Header */}
        <div className="bg-[#0c2340] text-white p-5 relative">
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Razorpay Trusted Gateway
            </span>
          </div>

          <div className="text-lg font-black tracking-tight text-white">
            Jyoti Hardware &amp; Construction
          </div>
          <div className="text-xs text-blue-200/80 mt-0.5">
            Makali Yard, Bangalore • GST Invoice Verified
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
            <span className="text-xs text-stone-300">Amount Payable:</span>
            <span className="text-2xl font-black text-white">
              ₹{orderTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-stone-100 border-b border-stone-200 text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('upi')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'upi'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                : 'hover:bg-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'card'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                : 'hover:bg-stone-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'netbanking'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600'
                : 'hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'upi' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl inline-block mx-auto shadow-inner">
                {/* Simulated dynamic UPI QR code */}
                <div className="w-40 h-40 bg-white border border-stone-300 rounded-lg p-2 flex flex-col items-center justify-center relative">
                  <QrCode className="w-32 h-32 text-stone-900" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[10px] font-black text-red-600 border border-stone-200">
                      JHC
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-stone-500 mt-2">
                  Scan with any UPI App
                </div>
              </div>

              {/* UPI Quick App Selector */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { id: 'gpay', name: 'Google Pay' },
                  { id: 'phonepe', name: 'PhonePe' },
                  { id: 'paytm', name: 'Paytm' },
                  { id: 'bhim', name: 'BHIM' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedUpiApp(app.id)}
                    className={`p-2 rounded-lg border text-[11px] font-bold transition-all ${
                      selectedUpiApp === app.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                <span className="text-[11px]">Demo Mode: Test Card Preloaded</span>
                <span className="text-[10px] font-bold bg-blue-200 px-1.5 py-0.5 rounded">
                  Visa / Rupay
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-stone-600 mb-2">
                Select Your Bank for Instant Transfer:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Canara Bank'].map(
                  (b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                        selectedBank === b
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {b}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Action Button: Simulate Payment */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying with Bank...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Simulate Pay ₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>RBI Compliant 128-bit Encrypted Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
