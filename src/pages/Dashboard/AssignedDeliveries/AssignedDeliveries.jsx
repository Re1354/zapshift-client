import React from 'react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AssignedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['rider-deliveries', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/rider');
      return Array.isArray(res.data) ? res.data : res.data?.parcels || [];
    },
    enabled: !!user?.email,
  });

  const handleDeliveryAction = async (parcel, nextStatus) => {
    let title = '';
    let text = '';
    let confirmButtonText = '';
    let icon = 'question';

    if (nextStatus === 'driver-accepted') {
      title = 'Accept Delivery?';
      text = `Do you want to accept "${parcel.parcelName}"?`;
      confirmButtonText = 'Yes, Accept';
      icon = 'question';
    }

    if (nextStatus === 'driver-rejected') {
      title = 'Reject Delivery?';
      text = `Do you want to reject "${parcel.parcelName}"?`;
      confirmButtonText = 'Yes, Reject';
      icon = 'warning';
    }

    if (nextStatus === 'picked-up') {
      title = 'Pick Up Parcel?';
      text = `Have you picked up "${parcel.parcelName}" from the sender?`;
      confirmButtonText = 'Yes, Picked Up';
      icon = 'question';
    }

    if (nextStatus === 'in-transit') {
      title = 'Start Delivery?';
      text = `Are you ready to start delivering "${parcel.parcelName}"?`;
      confirmButtonText = 'Yes, Start Delivery';
      icon = 'question';
    }

    if (nextStatus === 'delivered') {
      title = 'Complete Delivery?';
      text = `Have you successfully delivered "${parcel.parcelName}" to the customer?`;
      confirmButtonText = 'Yes, Complete';
      icon = 'success';
    }

    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'Cancel',
      confirmButtonColor:
        nextStatus === 'driver-rejected' ? '#dc2626' : '#003b40',
    });

    if (!result.isConfirmed) return;

    try {
      // ✅ Removed trackingId — backend fetches it from DB
      const res = await axiosSecure.patch(
        `/parcels/${parcel._id}/delivery-status`,
        { deliveryStatus: nextStatus },
      );

      if (res.data?.success) {
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: res.data.message || 'Delivery status updated successfully.',
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
        <span className="loading loading-spinner loading-lg text-[#003b40]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Failed to load deliveries
        </h2>
        <p className="mt-2 text-gray-500">
          Something went wrong while loading your assigned parcels.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 rounded-lg bg-[#003b40] px-5 py-2 text-sm font-semibold text-white hover:bg-[#00565d]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const assignedParcels = parcels.filter(
    parcel =>
      parcel.deliveryStatus !== 'driver-rejected' &&
      parcel.deliveryStatus !== 'delivered',
  );

  const getStatusLabel = status => {
    switch (status) {
      case 'driver-assigned':
        return 'Assigned';
      case 'driver-accepted':
        return 'Accepted';
      case 'picked-up':
        return 'Picked Up';
      case 'in-transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'driver-rejected':
        return 'Rejected';
      default:
        return status || 'Unknown';
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'driver-assigned':
        return 'bg-blue-100 text-blue-700';
      case 'driver-accepted':
        return 'bg-green-100 text-green-700';
      case 'picked-up':
        return 'bg-purple-100 text-purple-700';
      case 'in-transit':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'driver-rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderActionButton = parcel => {
    const status = parcel.deliveryStatus;

    if (status === 'driver-assigned') {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDeliveryAction(parcel, 'driver-accepted')}
            className="rounded-lg bg-[#003b40] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#00565d]"
          >
            Accept
          </button>
          <button
            onClick={() => handleDeliveryAction(parcel, 'driver-rejected')}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      );
    }

    if (status === 'driver-accepted') {
      return (
        <button
          onClick={() => handleDeliveryAction(parcel, 'picked-up')}
          className="rounded-lg bg-[#003b40] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#00565d]"
        >
          Pick Up Parcel
        </button>
      );
    }

    if (status === 'picked-up') {
      return (
        <button
          onClick={() => handleDeliveryAction(parcel, 'in-transit')}
          className="rounded-lg bg-[#003b40] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#00565d]"
        >
          Start Delivery
        </button>
      );
    }

    if (status === 'in-transit') {
      return (
        <button
          onClick={() => handleDeliveryAction(parcel, 'delivered')}
          className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
        >
          Complete Delivery
        </button>
      );
    }

    return null;
  };

  if (assignedParcels.length === 0) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#003b40] md:text-3xl">
            Assigned Deliveries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your assigned parcel deliveries.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h11v11H3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 10h4l3 3v4h-7z"
              />
              <circle cx="7" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            No active deliveries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            You currently have no assigned deliveries to complete.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#003b40] md:text-3xl">
            Assigned Deliveries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your parcel delivery journey.
          </p>
        </div>
        <div className="rounded-xl bg-[#003b40] px-5 py-3 text-white">
          <p className="text-xs opacity-80">Active Deliveries</p>
          <p className="text-2xl font-bold">{assignedParcels.length}</p>
        </div>
      </div>

      {/* DESKTOP TABLE */}
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
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {assignedParcels.map(parcel => (
                <tr
                  key={parcel._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="px-5 py-5">
                    <p className="font-semibold text-gray-800">
                      {parcel.parcelName || 'Unnamed Parcel'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.trackingId || parcel._id}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.senderName || 'N/A'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.senderDistrict || 'N/A'}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.receiverName || 'N/A'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.receiverPhone || 'N/A'}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      {parcel.receiverDistrict || 'N/A'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {parcel.receiverAddress || ''}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(parcel.deliveryStatus)}`}
                    >
                      {getStatusLabel(parcel.deliveryStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-5">{renderActionButton(parcel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 lg:hidden">
        {assignedParcels.map(parcel => (
          <div
            key={parcel._id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {parcel.parcelName || 'Unnamed Parcel'}
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  {parcel.trackingId || parcel._id}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(parcel.deliveryStatus)}`}
              >
                {getStatusLabel(parcel.deliveryStatus)}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Destination
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  {parcel.receiverDistrict || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">
                  {parcel.receiverAddress || ''}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              {renderActionButton(parcel)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedDeliveries;
