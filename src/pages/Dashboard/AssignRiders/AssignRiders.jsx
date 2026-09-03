import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AssignRiders = () => {
  const axiosSecure = useAxiosSecure();

  // Modal ref
  const assignModalRef = useRef(null);

  // Selected parcel
  const [selectedParcel, setSelectedParcel] = useState(null);

  // =========================================================
  // GET PENDING PICKUP PARCELS
  // =========================================================
  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['parcels', 'pending-pickup'],
    queryFn: async () => {
      const res = await axiosSecure.get(
        '/parcels?deliveryStatus=pending-pickup',
      );

      return res.data;
    },
  });

  // =========================================================
  // GET AVAILABLE RIDERS
  // =========================================================
  const { data: riders = [] } = useQuery({
    queryKey: ['riders', selectedParcel?.senderDistrict, 'available'],
    enabled: !!selectedParcel,

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders?status=approved&district=${selectedParcel.senderDistrict}&workStatus=available`,
      );

      if (Array.isArray(res.data)) {
        return res.data;
      }

      if (Array.isArray(res.data?.riders)) {
        return res.data.riders;
      }

      return [];
    },
  });

  // =========================================================
  // OPEN ASSIGN RIDER MODAL
  // =========================================================
  const handleOpenAssignModal = parcel => {
    setSelectedParcel(parcel);

    assignModalRef.current?.showModal();
  };

  // =========================================================
  // CLOSE ASSIGN RIDER MODAL
  // =========================================================
  const handleCloseAssignModal = () => {
    assignModalRef.current?.close();
    setSelectedParcel(null);
  };

  // =========================================================
  // ASSIGN RIDER
  // =========================================================
  const handleAssignRider = async rider => {
    if (!selectedParcel?._id || !rider?._id) {
      return;
    }

    const riderAssignInfo = {
      riderId: rider._id,
      riderEmail: rider.email,
      riderName: rider.name,
    };

    try {
      const res = await axiosSecure.patch(
        `/parcels/${selectedParcel._id}`,
        riderAssignInfo,
      );

      if (res.data?.success) {
        // Close modal immediately
        handleCloseAssignModal();

        // Wait for dialog closing animation/render
        setTimeout(async () => {
          await Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Rider Assigned Successfully',
            text: `${rider.name} has been assigned to this parcel.`,
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });

          // Refresh pending parcel list
          refetch();
        }, 150);
      } else {
        // Close modal first
        handleCloseAssignModal();

        setTimeout(() => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Assignment Failed',
            text: res.data?.message || 'The rider could not be assigned.',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
          });
        }, 150);
      }
    } catch (error) {
      console.error('Assign rider error:', error);

      // Close modal first
      handleCloseAssignModal();

      setTimeout(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Something Went Wrong',
          text:
            error?.response?.data?.message ||
            'Failed to assign rider. Please try again.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }, 150);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (isError) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="font-medium text-red-500">Failed to load parcels</p>

        <p className="mt-1 text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div>
        <h2 className="text-2xl font-bold text-secondary">Assign Riders</h2>

        <p className="mt-1 text-sm text-gray-500">
          View pending parcels and assign riders for pickup.
        </p>
      </div>

      {/* =====================================================
          PARCEL LIST
      ====================================================== */}
      <div className="rounded-2xl bg-white shadow-sm">
        {/* ===================================================
            CARD HEADER
        ==================================================== */}
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-secondary">
            Pending Pickup Parcels
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {parcels.length} parcel
            {parcels.length !== 1 ? 's' : ''} waiting for rider assignment.
          </p>
        </div>

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}
        {parcels.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-secondary">
              No Pending Parcels
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are no parcels waiting for rider assignment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left">
              {/* =================================================
                  TABLE HEADER
              ================================================== */}
              <thead className="bg-[#f8f9fa]">
                <tr className="border-b border-gray-100">
                  {/* Parcel */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Parcel
                  </th>

                  {/* Receiver */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Receiver
                  </th>

                  {/* Destination */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Destination
                  </th>

                  {/* Cost */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Cost
                  </th>

                  {/* Delivery Status */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Delivery Status
                  </th>

                  {/* Created Time */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Created Time
                  </th>

                  {/* Pickup District */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Pickup District
                  </th>

                  {/* Action */}
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  TABLE BODY
              ================================================== */}
              <tbody>
                {parcels.map(parcel => (
                  <tr
                    key={parcel._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* Parcel */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-secondary">
                        {parcel.parcelName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        #{parcel._id?.slice(-6)}
                      </p>
                    </td>

                    {/* Receiver */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-secondary">
                        {parcel.receiverName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {parcel.receiverPhone}
                      </p>
                    </td>

                    {/* Destination */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-secondary">
                        {parcel.receiverDistrict}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {parcel.receiverRegion}
                      </p>
                    </td>

                    {/* Cost */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-secondary">
                        ৳{parcel.cost}
                      </span>
                    </td>

                    {/* Delivery Status */}
                    <td className="px-5 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                        {parcel.deliveryStatus || 'Pending'}
                      </span>
                    </td>

                    {/* Created Time */}
                    <td className="px-5 py-4">
                      {parcel.createdAt ? (
                        <div>
                          <p className="whitespace-nowrap text-xs font-medium text-gray-700">
                            {new Date(parcel.createdAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </p>

                          <p className="mt-1 whitespace-nowrap text-[11px] text-gray-400">
                            {new Date(parcel.createdAt).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>

                    {/* Pickup District */}
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-medium text-secondary">
                        {parcel.senderDistrict || 'N/A'}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleOpenAssignModal(parcel)}
                        className="whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-secondary transition hover:brightness-95"
                      >
                        Assign Rider
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================
          ASSIGN RIDER MODAL
      ========================================================== */}
      <dialog ref={assignModalRef} className="modal">
        <div className="modal-box max-w-lg rounded-2xl">
          {/* ===================================================
              MODAL HEADER
          ==================================================== */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary">Assign Rider</h3>

              <p className="mt-1 text-sm text-gray-500">
                Select a rider for this parcel.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseAssignModal}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          {/* ===================================================
              SELECTED PARCEL
          ==================================================== */}
          {selectedParcel && (
            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Selected Parcel
              </p>

              <h4 className="mt-1 text-base font-bold text-secondary">
                {selectedParcel.parcelName}
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                Parcel ID: #{selectedParcel._id?.slice(-6)}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Receiver */}
                <div>
                  <p className="text-xs text-gray-400">Receiver</p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedParcel.receiverName}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs text-gray-400">Phone</p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedParcel.receiverPhone}
                  </p>
                </div>

                {/* Pickup District */}
                <div>
                  <p className="text-xs text-gray-400">Pickup District</p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedParcel.senderDistrict || 'N/A'}
                  </p>
                </div>

                {/* Destination */}
                <div>
                  <p className="text-xs text-gray-400">Destination</p>

                  <p className="mt-1 text-sm font-medium text-secondary">
                    {selectedParcel.receiverDistrict}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              AVAILABLE RIDERS
          ==================================================== */}
          <div className="mt-5">
            <h4 className="mb-3 text-sm font-semibold text-secondary">
              Available Riders
            </h4>

            {riders.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-500">
                  No available riders found for this district.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {riders.map(rider => (
                  <div
                    key={rider._id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {rider.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {rider.email}
                      </p>
                    </div>

                    {/* Select */}
                    <button
                      type="button"
                      onClick={() => handleAssignRider(rider)}
                      className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-secondary transition hover:brightness-95"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===================================================
              MODAL ACTIONS
          ==================================================== */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleCloseAssignModal}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* Click outside modal to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AssignRiders;
