import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import {
  LuPackage,
  LuMapPin,
  LuUser,
  LuCreditCard,
  LuShieldCheck,
} from 'react-icons/lu';

import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

// ── Load Stripe (put your publishable key in .env) ──────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Card Element Styling ─────────────────────────────────────────────────────
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#202020',
      fontFamily: 'inherit',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ── Inner form (must be inside <Elements>) ───────────────────────────────────
const CheckoutForm = ({ parcel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError('');

    try {
      // 1. Create payment intent on your server
      const { data } = await axiosSecure.post('/create-payment-intent', {
        amount: parcel.cost, // send in BDT (your server should convert to paisa/smallest unit)
        parcelId: parcel._id,
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || parcel.senderName,
              email: user?.email,
            },
          },
        },
      );

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Save payment record to your DB
        await axiosSecure.patch(`/parcels/${parcel._id}/payment`, {
          paymentStatus: 'paid',
          transactionId: paymentIntent.id,
          paidAt: new Date().toISOString(),
          paidBy: user?.email,
        });

        await Swal.fire({
          title: 'Payment Successful!',
          html: `<p class="text-sm text-gray-500">Transaction ID:<br/><span class="font-mono text-xs text-secondary">${paymentIntent.id}</span></p>`,
          icon: 'success',
          confirmButtonColor: '#8aaa32',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl',
          },
        });

        navigate('/dashboard/my-parcels');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setCardError('Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Card Input ── */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
          Card Details
        </label>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {cardError && (
          <p className="mt-1.5 text-xs text-red-500">{cardError}</p>
        )}
      </div>

      {/* ── Test card hint ── */}
      <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600">
        🧪 Test card:{' '}
        <span className="font-mono font-semibold">4242 4242 4242 4242</span> ·
        Any future date · Any CVC
      </p>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {processing ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Processing…
          </>
        ) : (
          <>
            <LuCreditCard className="h-4 w-4" />
            Pay ৳{parcel.cost}
          </>
        )}
      </button>

      {/* ── Secure badge ── */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <LuShieldCheck className="h-3.5 w-3.5" />
        Secured by Stripe · 256-bit SSL
      </div>
    </form>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const Payment = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();

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

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // ── Error ──
  if (isError || !parcel) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="font-medium text-red-500">
          Failed to load parcel details.
        </p>
      </div>
    );
  }

  // ── Already paid ──
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
      {/* ── Page Heading ── */}
      <div>
        <h2 className="text-2xl font-bold text-secondary">Payment</h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete your payment to confirm delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* ── Left: Parcel Summary ── */}
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-secondary">Order Summary</h3>

          {/* Parcel Info */}
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

          {/* Sender / Receiver */}
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

          {/* Divider */}
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

        {/* ── Right: Payment Form ── */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-semibold text-secondary">Pay with Card</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm parcel={parcel} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
