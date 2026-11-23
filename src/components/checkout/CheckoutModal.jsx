import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AddressStep } from './AddressStep';
import { PaymentStep } from './PaymentStep';
import { X, MapPin, CreditCard, ShieldCheck } from 'lucide-react';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen } = useStore();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
  };

  const handleOrderComplete = () => {
    setIsCheckoutOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Secure Checkout
            </h2>
            <p className="text-[11px] text-slate-500">256-bit SSL encrypted checkout experience</p>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress indicator */}
        <div className="px-6 py-3 bg-indigo-50/40 border-b border-indigo-100 flex items-center justify-center gap-8 text-xs font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span>Delivery Address</span>
          </div>

          <div className="w-8 h-[2px] bg-indigo-200" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>Payment & Gift Points</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          {step === 1 ? (
            <AddressStep onNext={() => setStep(2)} />
          ) : (
            <PaymentStep
              onBack={() => setStep(1)}
              onComplete={handleOrderComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
