import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  LuPackage,
  LuMapPin,
  LuUser,
  LuCreditCard,
  LuShieldCheck,
  LuExternalLink,
} from 'react-icons/lu';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const steps = [
  'Click the Pay button below',
  'Complete payment on Stripe secure page',
  'You will be redirected back automatically',
];

const Payment = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  const {
    isLoading,
    isError,
    data: parcel,
  } = useQuery({
    queryKey: ['parcel', parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  const handlePayment = async () => {
    setRedirecting(true);
    try {
      const res = await axiosSecure.post('/payment-checkout-session', {
        cost: parcel.cost,
        parcelId: parcel._id,
        senderEmail: user?.email,
        parcelName: parcel.parcelName,
      });
      window.location.href = res.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      setRedirecting(false);
      Swal.fire({
        title: 'Something went wrong',
        text: 'Failed to initiate payment. Please try again.',
        icon: 'error',
        confirmButtonColor: '#202020',
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isError || !parcel) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="font-medium text-red-500">
          Failed to load parcel details.
        </p>
      </div>
    );
  }

  if (parcel.paymentStatus === 'paid') {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f5e8]">
          <LuShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-secondary">Already Paid</h2>
        <p className="mt-1 text-sm text-gray-500">
          This parcel has already been paid for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-secondary">Payment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete your payment to confirm delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left: Order Summary */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-secondary">Order Summary</h3>

          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#f1f5e8]">
              <LuPackage className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-secondary">
                {parcel.parcelName}
              </p>
              <p className="text-xs text-gray-400">
                #{parcel._id?.slice(-6)} · {parcel.parcelType} ·{' '}
                {parcel.parcelWeight} KG
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <LuUser className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Sender</p>
                <p className="text-sm font-medium text-secondary">
                  {parcel.senderName}
                </p>
                <p className="text-xs text-gray-400">{parcel.senderDistrict}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LuMapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Receiver</p>
                <p className="text-sm font-medium text-secondary">
                  {parcel.receiverName}
                </p>
                <p className="text-xs text-gray-400">
                  {parcel.receiverDistrict}, {parcel.receiverRegion}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Delivery Cost</span>
              <span>৳{parcel.cost}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-secondary">Total</span>
              <span className="text-xl font-bold text-secondary">
                ৳{parcel.cost}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Checkout */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h3 className="font-semibold text-secondary">Pay with Stripe</h3>
            <p className="mt-1 text-sm text-gray-500">
              You will be redirected to Stripe's secure checkout page to
              complete your payment.
            </p>

            {/* Paying as */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-xs text-gray-500">Paying as</span>
              <span className="text-xs font-semibold text-secondary">
                {user?.email}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f1f5e8] text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-500">Amount due</span>
              <span className="text-lg font-bold text-secondary">
                ৳{parcel.cost}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handlePayment}
              disabled={redirecting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redirecting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  <LuCreditCard className="h-4 w-4" />
                  Pay ৳{parcel.cost}
                  <LuExternalLink className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <LuShieldCheck className="h-3.5 w-3.5" />
              Secured by Stripe · 256-bit SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
