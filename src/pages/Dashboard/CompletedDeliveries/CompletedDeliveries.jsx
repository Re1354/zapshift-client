import React from 'react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ==================================================
  // GET COMPLETED DELIVERIES
  // ==================================================

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['rider-deliveries', user?.email, 'delivered'],

    queryFn: async () => {
      const res = await axiosSecure.get(
        '/parcels/rider?deliveryStatus=delivered',
      );

      if (Array.isArray(res.data)) {
        return res.data;
      }

      return res.data?.parcels || [];
    },

    enabled: !!user?.email,
  });

  // ==================================================
  // CALCULATE RIDER PAYOUT
  // ==================================================

  const calculatePayout = parcel => {
    const cost = Number(parcel.cost);

    if (!Number.isFinite(cost) || cost <= 0) {
      return 0;
    }

    // Same district = 80%
    if (
      parcel.senderDistrict &&
      parcel.receiverDistrict &&
      parcel.senderDistrict === parcel.receiverDistrict
    ) {
      return cost * 0.8;
    }

    // Different district = 60%
    return cost * 0.6;
  };

  // ==================================================
  // CHECKOUT
  // ==================================================

  const handleCheckout = async parcel => {
    const payout = calculatePayout(parcel);

    if (payout <= 0) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Invalid payout amount.',
        showConfirmButton: false,
        timer: 2500,
      });

      return;
    }

    const result = await Swal.fire({
      title: 'Checkout Payout?',
      text: `You will receive ৳${payout.toFixed(
        2,
      )} for "${parcel.parcelName}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Checkout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#003b40',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // ------------------------------------------------
      // IMPORTANT:
      // Backend checkout endpoint should be connected here.
      // ------------------------------------------------

      console.log('Checkout parcel:', parcel._id);
      console.log('Payout amount:', payout);

      /*
      Example future API:

      const res = await axiosSecure.post(
        `/rider/payout/${parcel._id}`,
        {
          amount: payout,
        },
      );

      if (res.data?.success) {
        ...
      }
      */

      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Checkout amount: ৳${payout.toFixed(2)}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Checkout error:', error);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: error.response?.data?.message || 'Failed to checkout payout.',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#003b40]"></span>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load completed deliveries
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while loading your delivery history.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 rounded-lg bg-[#003b40] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#00565d]"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ==================================================
  // EMPTY STATE
  // ==================================================

  if (parcels.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#003b40] md:text-3xl">
            Completed Deliveries
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your successfully completed deliveries.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12l2.5 2.5L16 9"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            No completed deliveries
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your completed deliveries will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // TOTAL PAYOUT
  // ==================================================

  const totalPayout = parcels.reduce(
    (total, parcel) => total + calculatePayout(parcel),
    0,
  );

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#003b40] md:text-3xl">
            Completed Deliveries
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your successfully completed deliveries.
          </p>
        </div>

        {/* SUMMARY */}

        <div className="flex gap-3">
          <div className="rounded-xl bg-[#003b40] px-5 py-3 text-white">
            <p className="text-xs opacity-80">Total Completed</p>

            <p className="text-2xl font-bold">{parcels.length}</p>
          </div>

          <div className="rounded-xl bg-green-600 px-5 py-3 text-white">
            <p className="text-xs opacity-80">Total Payout</p>

            <p className="text-2xl font-bold">৳{totalPayout.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ==================================================
          DESKTOP TABLE
      ================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Parcel
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sender
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Receiver
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Destination
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cost
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Payout
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Completed At
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Checkout
                </th>
              </tr>
            </thead>

            <tbody>
              {parcels.map(parcel => (
                <tr
                  key={parcel._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  {/* PARCEL */}

                  <td className="px-5 py-5">
                    <p className="font-semibold text-gray-800">
                      {parcel.parcelName || 'Unnamed Parcel'}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.trackingId || parcel._id}
                    </p>
                  </td>

                  {/* SENDER */}

                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.senderName || 'N/A'}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.senderDistrict || 'N/A'}
                    </p>
                  </td>

                  {/* RECEIVER */}

                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.receiverName || 'N/A'}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.receiverPhone || 'N/A'}
                    </p>
                  </td>

                  {/* DESTINATION */}

                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.receiverDistrict || 'N/A'}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.receiverAddress || 'N/A'}
                    </p>
                  </td>

                  {/* COST */}

                  <td className="px-5 py-5">
                    <p className="text-sm font-semibold text-gray-700">
                      ৳{Number(parcel.cost || 0).toFixed(2)}
                    </p>
                  </td>

                  {/* PAYOUT */}

                  <td className="px-5 py-5">
                    <p className="text-sm font-bold text-green-700">
                      ৳{calculatePayout(parcel).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.senderDistrict === parcel.receiverDistrict
                        ? '80% payout'
                        : '60% payout'}
                    </p>
                  </td>

                  {/* COMPLETED AT */}

                  <td className="px-5 py-5">
                    {parcel.updatedAt ? (
                      <>
                        <p className="text-sm text-gray-700">
                          {new Date(parcel.updatedAt).toLocaleDateString()}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(parcel.updatedAt).toLocaleTimeString()}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Delivered
                    </span>
                  </td>

                  {/* CHECKOUT */}

                  <td className="px-5 py-5">
                    <button
                      onClick={() => handleCheckout(parcel)}
                      className="rounded-lg bg-[#003b40] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#00565d]"
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================
          MOBILE / TABLET CARDS
      ================================================== */}

      <div className="grid gap-4 lg:hidden">
        {parcels.map(parcel => (
          <div
            key={parcel._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* CARD HEADER */}

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {parcel.parcelName || 'Unnamed Parcel'}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {parcel.trackingId || parcel._id}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Delivered
              </span>
            </div>

            {/* DETAILS */}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* SENDER */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Sender
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {parcel.senderName || 'N/A'}
                </p>

                <p className="text-xs text-gray-400">
                  {parcel.senderDistrict || 'N/A'}
                </p>
              </div>

              {/* RECEIVER */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Receiver
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {parcel.receiverName || 'N/A'}
                </p>

                <p className="text-xs text-gray-400">
                  {parcel.receiverPhone || 'N/A'}
                </p>
              </div>

              {/* DESTINATION */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Destination
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {parcel.receiverDistrict || 'N/A'}
                </p>

                <p className="text-xs text-gray-400">
                  {parcel.receiverAddress || 'N/A'}
                </p>
              </div>

              {/* COST */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Cost
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  ৳{Number(parcel.cost || 0).toFixed(2)}
                </p>
              </div>

              {/* PAYOUT */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Payout
                </p>

                <p className="mt-1 text-sm font-bold text-green-700">
                  ৳{calculatePayout(parcel).toFixed(2)}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {parcel.senderDistrict === parcel.receiverDistrict
                    ? '80% payout'
                    : '60% payout'}
                </p>
              </div>

              {/* COMPLETED */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Completed At
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {parcel.updatedAt
                    ? new Date(parcel.updatedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* CHECKOUT */}

            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                onClick={() => handleCheckout(parcel)}
                className="w-full rounded-lg bg-[#003b40] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00565d]"
              >
                Checkout ৳{calculatePayout(parcel).toFixed(2)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
