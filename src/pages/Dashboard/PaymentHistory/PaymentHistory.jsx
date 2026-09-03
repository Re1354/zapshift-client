import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LuCircleCheck,
  LuClock3,
  LuCreditCard,
  LuEye,
  LuHash,
  LuPackage,
  LuX,
} from 'react-icons/lu';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedPayment, setSelectedPayment] = useState(null);

  console.log(user);
  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['payments', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?email=${encodeURIComponent(user.email)}`,
      );

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // =====================================================
  // Helpers
  // =====================================================

  const formatDate = date => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = date => {
    if (!date) return '';

    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = payment => {
    const amount = Number(payment?.amount || 0);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: payment?.currency?.toUpperCase() || 'USD',
    }).format(amount);
  };

  const getPaymentStatus = status => {
    if (status === 'paid') {
      return {
        label: 'Paid',
        className: 'bg-[#f1f5e8] text-primary',
        icon: <LuCircleCheck className="h-3.5 w-3.5" />,
      };
    }

    return {
      label: status || 'Pending',
      className: 'bg-yellow-50 text-yellow-600',
      icon: <LuClock3 className="h-3.5 w-3.5" />,
    };
  };

  // =====================================================
  // Loading
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <LuCreditCard className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-xl font-bold text-secondary">
            Failed to Load Payment History
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Something went wrong while loading your payment history. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // Main
  // =====================================================

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-secondary">Payment History</h2>

          <p className="mt-1 text-sm text-gray-500">
            View all your completed parcel payments.
          </p>
        </div>

        {/* Payment Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {payments.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5e8]">
                <LuCreditCard className="h-7 w-7 text-primary" />
              </div>

              <h3 className="text-lg font-bold text-secondary">
                No Payment History
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                You have not completed any payments yet.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Parcel Info
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Customer Info
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Tracking Number
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Payment Info
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map(payment => {
                      const paymentStatus = getPaymentStatus(
                        payment.paymentStatus,
                      );

                      return (
                        <tr
                          key={payment._id}
                          className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50/60"
                        >
                          {/* Parcel Info */}
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#f1f5e8]">
                                <LuPackage className="h-5 w-5 text-primary" />
                              </div>

                              <div>
                                <p className="font-semibold text-secondary">
                                  {payment.parcelName || 'Unnamed Parcel'}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {formatDate(payment.paidAt)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Customer Info */}
                          <td className="px-5 py-5">
                            <div>
                              <p className="text-sm font-medium text-secondary">
                                {payment.customerEmail || '—'}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Customer
                              </p>
                            </div>
                          </td>

                          {/* Tracking */}
                          <td className="px-5 py-5">
                            <p className="font-mono text-sm font-medium text-secondary">
                              {payment.trackingId || '—'}
                            </p>
                          </td>

                          {/* Payment */}
                          <td className="px-5 py-5">
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-secondary">
                                {formatAmount(payment)}
                              </p>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatus.className}`}
                              >
                                {paymentStatus.icon}
                                {paymentStatus.label}
                              </span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-5 py-5">
                            <button
                              onClick={() => setSelectedPayment(payment)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#edf6f8] px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-[#e1eef1]"
                            >
                              <LuEye className="h-4 w-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet */}
              <div className="divide-y divide-gray-100 lg:hidden">
                {payments.map(payment => {
                  const paymentStatus = getPaymentStatus(payment.paymentStatus);

                  return (
                    <div key={payment._id} className="p-5">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#f1f5e8]">
                            <LuPackage className="h-5 w-5 text-primary" />
                          </div>

                          <div>
                            <p className="font-semibold text-secondary">
                              {payment.parcelName || 'Unnamed Parcel'}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatDate(payment.paidAt)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatus.className}`}
                        >
                          {paymentStatus.icon}
                          {paymentStatus.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Tracking Number
                          </p>

                          <p className="mt-1 break-all font-mono text-sm font-medium text-secondary">
                            {payment.trackingId || '—'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Amount</p>

                          <p className="mt-1 text-sm font-bold text-secondary">
                            {formatAmount(payment)}
                          </p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-xs text-gray-400">
                            Customer Email
                          </p>

                          <p className="mt-1 break-all text-sm font-medium text-secondary">
                            {payment.customerEmail || '—'}
                          </p>
                        </div>
                      </div>

                      {/* View */}
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#edf6f8] py-2.5 text-sm font-semibold text-secondary transition hover:bg-[#e1eef1]"
                      >
                        <LuEye className="h-4 w-4" />
                        View Payment
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <p className="text-xs text-gray-400">
                  Showing {payments.length}{' '}
                  {payments.length === 1 ? 'payment' : 'payments'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          Payment Details Modal
      ===================================================== */}

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={event => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-secondary">
                  Payment Details
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Payment and transaction information
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-secondary"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              {/* Parcel */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5e8]">
                    <LuPackage className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Parcel</p>

                    <p className="truncate font-semibold text-secondary">
                      {selectedPayment.parcelName || 'Unnamed Parcel'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-4">
                {/* Amount */}
                <div className="flex items-start gap-3">
                  <LuCreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-400">Payment Amount</p>

                    <p className="mt-1 text-sm font-bold text-secondary">
                      {formatAmount(selectedPayment)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3">
                  <LuCircleCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-400">Payment Status</p>

                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        getPaymentStatus(selectedPayment.paymentStatus)
                          .className
                      }`}
                    >
                      {getPaymentStatus(selectedPayment.paymentStatus).icon}

                      {getPaymentStatus(selectedPayment.paymentStatus).label}
                    </span>
                  </div>
                </div>

                {/* Tracking */}
                <div className="flex items-start gap-3">
                  <LuHash className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-400">Tracking Number</p>

                    <p className="mt-1 break-all font-mono text-sm font-medium text-secondary">
                      {selectedPayment.trackingId || '—'}
                    </p>
                  </div>
                </div>

                {/* Customer Email */}
                <div className="flex items-start gap-3">
                  <LuCreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Customer Email</p>

                    <p className="mt-1 break-all text-sm font-medium text-secondary">
                      {selectedPayment.customerEmail || '—'}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <LuClock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-400">Payment Date</p>

                    <p className="mt-1 text-sm font-medium text-secondary">
                      {formatDate(selectedPayment.paidAt)}
                    </p>

                    <p className="text-xs text-gray-400">
                      {formatTime(selectedPayment.paidAt)}
                    </p>
                  </div>
                </div>

                {/* Transaction */}
                <div className="flex items-start gap-3">
                  <LuHash className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      Stripe Transaction ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-secondary">
                      {selectedPayment.transactionId || '—'}
                    </p>
                  </div>
                </div>

                {/* Parcel ID */}
                <div className="flex items-start gap-3">
                  <LuPackage className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Parcel ID</p>

                    <p className="mt-1 break-all font-mono text-xs text-secondary">
                      {selectedPayment.parcelId?.toString() || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 px-6 py-4">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-secondary transition hover:brightness-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentHistory;
