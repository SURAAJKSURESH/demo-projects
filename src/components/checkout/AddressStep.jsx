import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, Plus, CheckCircle, Home, Briefcase, Building } from 'lucide-react';

export const AddressStep = ({ onNext }) => {
  const { addresses, selectedAddressId, setSelectedAddressId, addAddress } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New address form state
  const [formData, setFormData] = useState({
    title: 'Home',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.street.trim()) errs.street = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.zipCode.trim()) errs.zipCode = 'ZIP code is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newAddress = await addAddress(formData);
    if (!newAddress) return;
    setSelectedAddressId(newAddress.id);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Select Delivery Address
          </h3>
          <p className="text-xs text-slate-500">
            Choose where you would like your order delivered
          </p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Address
          </button>
        )}
      </div>

      {/* Existing addresses list */}
      {!showAddForm ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map(address => {
            const isSelected = selectedAddressId === address.id;

            return (
              <div
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {address.title === 'Home' ? (
                        <Home className="w-3 h-3 text-indigo-600" />
                      ) : (
                        <Briefcase className="w-3 h-3 text-indigo-600" />
                      )}
                      {address.title}
                    </span>

                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{address.fullName}</h4>
                  <p className="text-xs text-slate-600 mt-1">{address.street}</p>
                  <p className="text-xs text-slate-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Phone: {address.phone}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-indigo-100 text-[11px] text-indigo-700 font-semibold">
                    ✓ Selected for delivery
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Add new address inline form */
        <form onSubmit={handleSaveNewAddress} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">Add New Shipping Address</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Address Label</label>
              <select
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work / Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Receiver's name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
              {errors.fullName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.fullName}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="House number, street name, apartment/suite"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
              {errors.street && <p className="text-[10px] text-rose-500 mt-0.5">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
              {errors.city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State & ZIP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="State (e.g. WA)"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
              {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Save Address & Select
          </button>
        </form>
      )}

      {/* Bottom Continue button */}
      {!showAddForm && (
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onNext}
            disabled={!selectedAddressId}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
          >
            Continue to Payment →
          </button>
        </div>
      )}
    </div>
  );
};
