import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CreditCard,
  QrCode,
  Wallet,
  Truck,
  Award,
  ShieldCheck,
  Check,
  Loader2,
  Lock,
} from 'lucide-react';

export const PaymentStep = ({ onBack, onComplete }) => {
  const {
    cart,
    cartSubtotal,
    user,
    addresses,
    selectedAddressId,
    placeOrder,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: '4242 •••• •••• 4242',
    name: user.name || 'Alex Johnson',
    expiry: '12/28',
    cvv: '888',
  });

  // UPI ID state
  const [upiId, setUpiId] = useState('alex@okaxis');

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Max points eligible: 100 points = $10 discount ($0.10/point). Subtotal cannot go below 0.
  const maxRedeemablePoints = Math.min(
    user.giftPoints || 0,
    Math.floor((cartSubtotal * 10))
  );

  const discountFromPoints = pointsToRedeem * 0.1;
  const shippingFee = cartSubtotal >= 35 ? 0 : 4.99;
  const taxableSubtotal = Math.max(0, cartSubtotal - discountFromPoints);
  const tax = taxableSubtotal * 0.085;
  const total = taxableSubtotal + tax + shippingFee;
  const pointsEarned = Math.round(total);

  const handleRedeemMax = () => {
    setPointsToRedeem(maxRedeemablePoints);
  };

  const handleSliderChange = (e) => {
    setPointsToRedeem(Number(e.target.value));
  };

  const handleCommitPayment = () => {
    setIsProcessing(true);

    let methodLabel = 'Credit Card (ending in 4242)';
    if (paymentMethod === 'upi') methodLabel = `UPI (${upiId})`;
    if (paymentMethod === 'wallet') methodLabel = 'Apple Pay / Digital Wallet';
    if (paymentMethod === 'cod') methodLabel = 'Cash on Delivery (Pay upon arrival)';

    setTimeout(() => {
      setIsProcessing(false);
      const placed = placeOrder({
        paymentMethod: methodLabel,
        pointsToRedeem,
        shippingFee,
        deliveryAddress: selectedAddress,
      });
      onComplete(placed);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Gift points redemption box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Award className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Redeem Gift Points</h4>
              <p className="text-xs text-amber-900">
                You have <strong className="font-extrabold">{user.giftPoints || 0} Points</strong> available (100 pts = $10 off)
              </p>
            </div>
          </div>

          <button
            onClick={handleRedeemMax}
            className="text-xs font-bold text-amber-800 bg-amber-200/80 hover:bg-amber-300 px-3 py-1 rounded-lg transition-colors"
          >
            Redeem Max
          </button>
        </div>

        {user.giftPoints > 0 ? (
          <div className="space-y-2 mt-3 pt-3 border-t border-amber-200/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Points to Redeem:</span>
              <span className="font-extrabold text-amber-800">
                {pointsToRedeem} pts (-${discountFromPoints.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxRedeemablePoints}
              step="10"
              value={pointsToRedeem}
              onChange={handleSliderChange}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-2">
            You do not currently have points. You will earn +{pointsEarned} points on this purchase!
          </p>
        )}
      </div>

      {/* Select Payment Method */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-3">Choose Payment Method</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card Option */}
          <div
            onClick={() => setPaymentMethod('card')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
              paymentMethod === 'card'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
              <p className="text-[11px] text-slate-500">Visa, MasterCard, Amex</p>
            </div>
            {paymentMethod === 'card' && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
          </div>

          {/* UPI / Net Banking Option */}
          <div
            onClick={() => setPaymentMethod('upi')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
              paymentMethod === 'upi'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">UPI / QR Payment</p>
              <p className="text-[11px] text-slate-500">Instant direct bank transfer</p>
            </div>
            {paymentMethod === 'upi' && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
          </div>

          {/* Digital Wallet */}
          <div
            onClick={() => setPaymentMethod('wallet')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
              paymentMethod === 'wallet'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Digital Wallets</p>
              <p className="text-[11px] text-slate-500">Apple Pay, Google Pay, PayPal</p>
            </div>
            {paymentMethod === 'wallet' && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
          </div>

          {/* Cash on Delivery */}
          <div
            onClick={() => setPaymentMethod('cod')}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
              paymentMethod === 'cod'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
              <p className="text-[11px] text-slate-500">Pay at your doorstep</p>
            </div>
            {paymentMethod === 'cod' && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
          </div>
        </div>
      </div>

      {/* Dynamic Payment Details Input */}
      {paymentMethod === 'card' && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Card Information (Encrypted)</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Lock className="w-3 h-3" /> 256-bit SSL
            </span>
          </div>

          <input
            type="text"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono font-medium outline-none focus:border-indigo-500"
            placeholder="Card Number"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
              placeholder="MM/YY"
            />
            <input
              type="password"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
              placeholder="CVV"
            />
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Virtual Payment Address (VPA / UPI ID)</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-500"
            placeholder="yourname@bank"
          />
        </div>
      )}

      {/* Order Pricing Breakdown */}
      <div className="bg-slate-100/80 p-4 rounded-2xl space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">${cartSubtotal.toFixed(2)}</span>
        </div>
        {discountFromPoints > 0 && (
          <div className="flex justify-between text-amber-700 font-bold">
            <span>Points Discount ({pointsToRedeem} pts)</span>
            <span>-${discountFromPoints.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Shipping (Express Delivery)</span>
          <span className="font-semibold text-emerald-600">
            {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Estimated Tax (8.5%)</span>
          <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-slate-200 pt-2 flex justify-between text-sm sm:text-base font-black text-slate-900">
          <span>Total Amount</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          ← Back to Address
        </button>

        <button
          onClick={handleCommitPayment}
          disabled={isProcessing}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authorizing Payment...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Payment (${total.toFixed(2)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
