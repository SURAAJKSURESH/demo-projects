import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  CheckCircle2,
  Truck,
  Award,
  Package,
  ArrowRight,
  Clock,
  Sparkles,
  Download,
  Calendar,
} from 'lucide-react';

export const OrderConfirmationModal = () => {
  const {
    latestConfirmedOrder,
    setLatestConfirmedOrder,
    setActiveView,
    buyAgain,
  } = useStore();

  if (!latestConfirmedOrder) return null;

  const order = latestConfirmedOrder;

  const handleGoToOrders = () => {
    setLatestConfirmedOrder(null);
    setActiveView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueShopping = () => {
    setLatestConfirmedOrder(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Celebration Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-900 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
            Purchase Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Thank you for your order!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md mx-auto">
            Order <strong className="text-white font-mono">{order.id}</strong> is being prepared. A receipt has been sent to your email.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Eligible for free order cancellation within 48 hours</span>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Estimated Delivery & Address Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase">Tentative Delivery</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{order.tentativeDelivery}</p>
                <p className="text-[11px] text-emerald-600 font-medium">Standard Tracked Express</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-amber-800 font-semibold uppercase">Points Rewards</p>
                <p className="text-sm font-black text-amber-950 mt-0.5">+{order.pointsEarned} Gift Points Earned</p>
                {order.pointsRedeemed > 0 && (
                  <p className="text-[11px] text-amber-700">Redeemed: {order.pointsRedeemed} pts</p>
                )}
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Items in this Shipment ({order.items?.length})
            </h4>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded-md shadow-xs shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-slate-100 p-4 rounded-2xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discountFromPoints > 0 && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Gift Points Discount</span>
                <span>-${order.discountFromPoints.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-emerald-600">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (8.5%)</span>
              <span className="font-semibold text-slate-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
              <span>Total Paid ({order.paymentMethod})</span>
              <span className="text-indigo-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleGoToOrders}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              View in Order History
            </button>

            <button
              onClick={handleContinueShopping}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
