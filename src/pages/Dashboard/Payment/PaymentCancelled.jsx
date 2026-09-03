import React from 'react';
import { useNavigate } from 'react-router';
import { LuCircleX, LuRefreshCw, LuArrowLeft } from 'react-icons/lu';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        {/* Cancel Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-red-100 opacity-60"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <LuCircleX className="h-12 w-12 text-red-400" strokeWidth={1.5} />{' '}
            {/*  */}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-secondary">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-secondary">
              Payment Status
            </span>
            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
              Cancelled
            </span>
          </div>

          <div className="my-6 border-t border-gray-100" />

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95"
            >
              <LuRefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <button
              onClick={() => navigate('/dashboard/my-parcels')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-secondary transition hover:bg-gray-50"
            >
              <LuArrowLeft className="h-4 w-4" />
              Back to My Parcels
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentCancelled;
