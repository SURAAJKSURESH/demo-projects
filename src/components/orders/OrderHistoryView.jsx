import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  RotateCcw,
  XCircle,
  Truck,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const OrderHistoryView = () => {
  const { orders, buyAgain, cancelOrder, setActiveView, user } = useStore();
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const formatOrderDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getHoursRemaining = (isoString) => {
    const orderTime = new Date(isoString).getTime();
    const now = Date.now();
    const hoursElapsed = (now - orderTime) / (1000 * 60 * 60);
    const hoursLeft = Math.max(0, 48 - hoursElapsed);
    return hoursLeft;
  };

  const handleConfirmCancel = () => {
    if (cancellingOrderId) {
      cancelOrder(cancellingOrderId);
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Points Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-indigo-900/40">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            My Order History & Rewards
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track active shipments, re-order your favorite books with 1 click, and manage cancellations.
          </p>
        </div>

        {/* Gift Points balance pill */}
        <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 shrink-0 backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Available Points</p>
            <p className="text-2xl font-black text-white">{user.giftPoints || 0} pts</p>
            <p className="text-[10px] text-slate-400">Worth ${( (user.giftPoints || 0) * 0.1 ).toFixed(2)} in discounts</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Your Orders ({orders.length})
          </h2>
          <span className="text-xs text-slate-500">
            48-hour free cancellation policy applies to processing orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No past orders yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't placed any book orders yet. Browse our top titles and place your first order today!
            </p>
            <button
              onClick={() => setActiveView('catalog')}
              className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Explore Catalogue
            </button>
          </div>
        ) : (
          orders.map(order => {
            const hoursLeft = getHoursRemaining(order.createdAt);
            const isCancellable = order.status === 'Processing' && hoursLeft > 0;

            let statusBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
            if (order.status === 'Delivered') statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (order.status === 'Cancelled') statusBg = 'bg-rose-50 text-rose-700 border-rose-200';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order card top bar */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-slate-400 block font-medium text-[11px]">ORDER PLACED</span>
                      <span className="font-bold text-slate-800">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium text-[11px]">ORDER ID</span>
                      <span className="font-mono font-bold text-indigo-600">#{order.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium text-[11px]">TOTAL AMOUNT</span>
                      <span className="font-black text-slate-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBg}`}>
                      ● {order.status}
                    </span>
                  </div>
                </div>

                {/* Delivery and Cancellation status notice */}
                <div className="px-5 py-3 bg-indigo-50/30 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Tentative Delivery: <strong className="font-bold text-slate-900">{order.tentativeDelivery}</strong>
                    </span>
                  </div>

                  {order.status === 'Processing' && (
                    <div className="flex items-center gap-2">
                      {isCancellable ? (
                        <>
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            {Math.floor(hoursLeft)}h {Math.round((hoursLeft % 1) * 60)}m left to cancel
                          </span>
                          <button
                            onClick={() => setCancellingOrderId(order.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-colors"
                          >
                            Cancel Order
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">48h cancellation window expired</span>
                      )}
                    </div>
                  )}

                  {order.status === 'Cancelled' && (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Cancelled within 48-hr window (Refund Issued)
                    </span>
                  )}
                </div>

                {/* Order items list with "Buy In Again" action */}
                <div className="p-5 sm:p-6 space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/70 rounded-2xl border border-slate-100"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500">by {item.author}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="font-bold text-slate-800">${item.price.toFixed(2)}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Buy In Again Button (Capstone requirement) */}
                      <button
                        onClick={() => buyAgain(item)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Buy In Again</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment summary footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Delivering to: <strong className="text-slate-700">{order.deliveryAddress?.fullName}</strong> ({order.deliveryAddress?.street})
                  </span>
                  <span>
                    Payment Method: <strong className="text-slate-700">{order.paymentMethod}</strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Cancel Order #{cancellingOrderId}?</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are cancelling within the 48-hour complimentary cancellation window.
                Any redeemed points will be refunded to your balance immediately.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
