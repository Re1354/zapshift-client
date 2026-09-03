import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  LuCircleCheck,
  LuPackage,
  LuArrowRight,
  LuCircleAlert,
} from 'react-icons/lu';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Payment session could not be found.');
      return;
    }

    const updatePayment = async () => {
      try {
        setStatus('processing');
        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`,
        );
        if (res.data?.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(
            res.data?.message || 'Payment could not be verified.',
          );
        }
      } catch (error) {
        console.error('Payment update error:', error);
        setStatus('error');
        setErrorMessage(
          error?.response?.data?.message ||
            'Something went wrong while confirming your payment.',
        );
      }
    };

    updatePayment();
  }, [sessionId, axiosSecure]);

  // Processing
  if (status === 'processing') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f5e8]">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            Confirming Payment...
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your payment.
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (status === 'error') {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <LuCircleAlert
              className="h-10 w-10 text-red-500"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            Payment Verification Failed
          </h2>
          <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard/my-parcels')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95"
            >
              Back to My Parcels
              <LuArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-secondary transition hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#f1f5e8]">
            <LuCircleCheck
              className="h-12 w-12 text-primary"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-secondary">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your payment has been confirmed and your parcel is now being
            processed.
          </p>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5e8]">
                <LuPackage className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </div>
              <span className="text-sm font-medium text-secondary">
                Payment Status
              </span>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#f1f5e8] px-3 py-1 text-xs font-semibold text-primary">
              Paid
            </span>
          </div>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/dashboard/my-parcels')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95"
            >
              View My Parcels
              <LuArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-secondary transition hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Your payment has been successfully recorded.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
