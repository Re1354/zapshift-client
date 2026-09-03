import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

const AssignedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['parcels', user?.email, 'driver-assigned'],

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/parcels/rider?riderEmail=${user.email}&deliveryStatus=driver-assigned`,
      );

      if (Array.isArray(res.data)) {
        return res.data;
      }

      return res.data?.parcels || [];
    },

    enabled: !!user?.email,
  });

  // Accept or reject delivery
  const handleDeliveryAction = async (parcel, status) => {
    const isAccept = status === 'driver-accepted';

    const result = await Swal.fire({
      title: isAccept ? 'Accept Delivery?' : 'Reject Delivery?',
      text: isAccept
        ? `Do you want to accept "${parcel.parcelName}"?`
        : `Do you want to reject "${parcel.parcelName}"?`,
      icon: isAccept ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: isAccept ? 'Yes, Accept' : 'Yes, Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: isAccept ? '#003b40' : '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await axiosSecure.patch(
        `/parcels/${parcel._id}/delivery-status`,
        {
          deliveryStatus: status,
        },
      );

      if (res.data?.success) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: isAccept
            ? 'Delivery accepted successfully.'
            : 'Delivery rejected successfully.',
          showConfirmButton: false,
          timer: 2000,
        });

        refetch();
      }
    } catch (error) {
      console.error('Delivery action error:', error);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title:
          error.response?.data?.message || 'Failed to update delivery status.',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#003b40]"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-5">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Failed to load deliveries
          </h3>

          <p className="mt-1 text-sm text-red-500">
            Something went wrong while loading your assigned deliveries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#003b40]">
          Assigned Deliveries
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          View all parcels currently assigned to you.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 rounded-xl bg-[#003b40] p-5 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/10 p-3">
            <FaTruck className="text-2xl" />
          </div>

          <div>
            <p className="text-sm text-white/70">Total Assigned Deliveries</p>

            <h3 className="text-2xl font-bold">{parcels.length}</h3>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {parcels.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <FaTruck className="mx-auto mb-4 text-4xl text-gray-300" />

          <h3 className="text-lg font-semibold text-gray-700">
            No Assigned Deliveries
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            You don't have any deliveries assigned right now.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-5 py-4">Parcel</th>

                  <th className="px-5 py-4">Receiver</th>

                  <th className="px-5 py-4">Destination</th>

                  <th className="px-5 py-4">Phone</th>

                  <th className="px-5 py-4">Cost</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {parcels.map(parcel => (
                  <tr
                    key={parcel._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    {/* Parcel */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {parcel.parcelName}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        ID: {parcel._id}
                      </p>
                    </td>

                    {/* Receiver */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">
                        {parcel.receiverName}
                      </p>
                    </td>

                    {/* Destination */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="mt-1 text-[#003b40]" />

                        <div>
                          <p className="font-medium text-gray-700">
                            {parcel.receiverDistrict}
                          </p>

                          <p className="text-xs text-gray-400">
                            {parcel.receiverAddress}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhoneAlt className="text-xs" />

                        {parcel.receiverPhone}
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-700">
                        ৳{parcel.cost}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleDeliveryAction(parcel, 'driver-accepted')
                          }
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                        >
                          <FaCheck />
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleDeliveryAction(parcel, 'driver-rejected')
                          }
                          className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          <FaTimes />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {parcels.map(parcel => (
              <div
                key={parcel._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">
                    {parcel.parcelName}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">ID: {parcel._id}</p>
                </div>

                {/* Information */}
                <div className="space-y-4 text-sm">
                  {/* Receiver */}
                  <div>
                    <p className="text-xs text-gray-400">Receiver</p>

                    <p className="font-medium text-gray-700">
                      {parcel.receiverName}
                    </p>
                  </div>

                  {/* Destination */}
                  <div>
                    <p className="text-xs text-gray-400">Destination</p>

                    <div className="mt-1 flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-1 text-[#003b40]" />

                      <div>
                        <p className="font-medium text-gray-700">
                          {parcel.receiverDistrict}
                        </p>

                        <p className="text-xs text-gray-500">
                          {parcel.receiverAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>

                    <div className="mt-1 flex items-center gap-2 text-gray-700">
                      <FaPhoneAlt className="text-xs" />

                      {parcel.receiverPhone}
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Delivery Cost</span>

                    <span className="font-bold text-[#003b40]">
                      ৳{parcel.cost}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-gray-100 pt-4">
                    <button
                      onClick={() =>
                        handleDeliveryAction(parcel, 'driver-accepted')
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <FaCheck />
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleDeliveryAction(parcel, 'driver-rejected')
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      <FaTimes />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AssignedDeliveries;
