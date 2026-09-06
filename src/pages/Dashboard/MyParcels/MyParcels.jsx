import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { LuEye, LuPencil, LuTrash2, LuX, LuPackage } from 'react-icons/lu';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

// ============================================================
// PARCEL DETAIL MODAL
// ============================================================

const ParcelDetailModal = ({ parcel, onClose }) => {
  if (!parcel) return null;

  const Field = ({ label, value }) => (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#003b40]">
        {value || '—'}
      </p>
    </div>
  );

  const deliveryStatusClass = status => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'in-transit':
        return 'bg-orange-100 text-orange-700';
      case 'picked-up':
        return 'bg-purple-100 text-purple-700';
      case 'driver-accepted':
        return 'bg-indigo-100 text-indigo-700';
      case 'driver-assigned':
        return 'bg-blue-100 text-blue-700';
      case 'pending-pickup':
        return 'bg-teal-100 text-teal-700';
      case 'driver-rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    /* ── Backdrop — click outside closes ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90dvh] w-full max-w-2xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── HEADER ───────────────────────────── */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5e8] text-[#003b40]">
              <LuPackage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#003b40]">
                {parcel.parcelName}
              </h2>
              <p className="mt-0.5 font-mono text-xs text-gray-400">
                #{parcel._id?.slice(-8)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        {/* ── BODY ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {/* STATUS BADGES */}
          <div className="mb-5 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                parcel.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {parcel.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${deliveryStatusClass(parcel.deliveryStatus)}`}
            >
              {parcel.deliveryStatus
                ? parcel.deliveryStatus.replace(/-/g, ' ')
                : 'Not Dispatched'}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
              {parcel.parcelType}
            </span>
          </div>

          {/* PARCEL INFO */}
          <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Parcel Info
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Parcel Name" value={parcel.parcelName} />
              <Field label="Type" value={parcel.parcelType} />
              <Field
                label="Weight"
                value={parcel.parcelWeight ? `${parcel.parcelWeight} KG` : null}
              />
              <Field
                label="Cost"
                value={parcel.cost ? `৳${parcel.cost}` : null}
              />
              {parcel.trackingId && (
                <div className="sm:col-span-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Tracking ID
                  </p>
                  <Link
                    to={`/parcel-track/${parcel.trackingId}`}
                    onClick={onClose}
                    className="mt-0.5 block font-mono text-sm font-semibold text-[#003b40] underline underline-offset-2 transition hover:text-[#8aaa32]"
                  >
                    {parcel.trackingId}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* SENDER INFO */}
          <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Sender Info
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Name" value={parcel.senderName} />
              <Field label="Phone" value={parcel.senderPhone} />
              <Field label="Email" value={parcel.senderEmail} />
              <Field label="Region" value={parcel.senderRegion} />
              <Field label="District" value={parcel.senderDistrict} />
              <Field label="Address" value={parcel.senderAddress} />
            </div>
          </div>

          {/* RECEIVER INFO */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Receiver Info
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Name" value={parcel.receiverName} />
              <Field label="Phone" value={parcel.receiverPhone} />
              <Field label="Email" value={parcel.receiverEmail} />
              <Field label="Region" value={parcel.receiverRegion} />
              <Field label="District" value={parcel.receiverDistrict} />
              <Field label="Address" value={parcel.receiverAddress} />
            </div>
          </div>
        </div>

        {/* ── FOOTER ───────────────────────────── */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 bg-white px-5 py-3.5 sm:px-6 sm:py-4">
          {parcel.trackingId && (
            <Link
              to={`/parcel-track/${parcel.trackingId}`}
              onClick={onClose}
              className="rounded-xl bg-[#c6ef52] px-5 py-2.5 text-sm font-semibold text-[#003b40] transition hover:brightness-95"
            >
              Track Parcel
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MY PARCELS
// ============================================================

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [detailParcel, setDetailParcel] = useState(null);

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Delete Parcel?',
      text: 'This parcel will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8aaa32',
      cancelButtonColor: '#202020',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/parcels/${id}`);

      if (res.data.deletedCount > 0) {
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your parcel has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#8aaa32',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl',
          },
        });
        refetch();
      }
    } catch (error) {
      console.error('Delete error:', error);
      Swal.fire({
        title: 'Cannot Delete',
        text: error?.response?.data?.message || 'Failed to delete the parcel.',
        icon: 'error',
        confirmButtonColor: '#202020',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl',
        },
      });
    }
  };

  const getDeliveryBadge = status => {
    const classes = {
      delivered: 'bg-green-100 text-green-700',
      'in-transit': 'bg-orange-100 text-orange-700',
      'picked-up': 'bg-purple-100 text-purple-700',
      'driver-accepted': 'bg-indigo-100 text-indigo-700',
      'driver-assigned': 'bg-blue-100 text-blue-700',
      'pending-pickup': 'bg-teal-100 text-teal-700',
      'driver-rejected': 'bg-red-100 text-red-700',
    };

    return (
      <span
        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          classes[status] || 'bg-gray-100 text-gray-600'
        }`}
      >
        {status ? status.replace(/-/g, ' ') : 'Not Dispatched'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

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
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">My Parcels</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all of your parcels.
          </p>
        </div>
        <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Parcels</p>
          <p className="text-xl font-bold text-secondary">{parcels.length}</p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {parcels.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 13h16l-2 7H6l-2-7z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-secondary">
            No parcels found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't created any parcels yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-semibold text-secondary">Parcel List</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px] text-left">
              <thead className="bg-[#f8f9fa]">
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Parcel
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Type
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Weight
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Destination
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Cost
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Payment
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Tracking ID
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Delivery Status
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {parcels.map(parcel => (
                  <tr
                    key={parcel._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* PARCEL */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-secondary">
                        {parcel.parcelName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        #{parcel._id?.slice(-6)}
                      </p>
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                        {parcel.parcelType}
                      </span>
                    </td>

                    {/* WEIGHT */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {parcel.parcelWeight} KG
                      </span>
                    </td>

                    {/* DESTINATION */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-secondary">
                        {parcel.receiverDistrict}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {parcel.receiverRegion}
                      </p>
                    </td>

                    {/* COST */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-secondary">
                        ৳{parcel.cost}
                      </span>
                    </td>

                    {/* DATE */}
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

                    {/* PAYMENT */}
                    <td className="px-5 py-4">
                      {parcel.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center rounded-full bg-[#f1f5e8] px-3 py-1 text-xs font-semibold text-secondary">
                          Paid
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/payment/${parcel._id}`)
                          }
                          className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-secondary transition hover:brightness-95"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>

                    {/* TRACKING ID */}
                    <td className="px-5 py-4">
                      {parcel.trackingId ? (
                        <Link
                          to={`/parcel-track/${parcel.trackingId}`}
                          className="font-mono text-xs font-semibold text-[#003b40] underline underline-offset-2 transition hover:text-[#8aaa32]"
                        >
                          {parcel.trackingId}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* DELIVERY STATUS */}
                    <td className="px-5 py-4">
                      {getDeliveryBadge(parcel.deliveryStatus)}
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Eye — opens detail modal */}
                        <button
                          type="button"
                          onClick={() => setDetailParcel(parcel)}
                          title="View Details"
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-secondary transition hover:border-secondary/30 hover:bg-gray-50"
                        >
                          <LuEye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit — same style, click does nothing */}
                        <button
                          type="button"
                          title="Edit"
                          className="inline-flex items-center justify-center rounded-lg bg-primary p-2 text-secondary transition hover:brightness-95"
                        >
                          <LuPencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(parcel._id)}
                          title="Delete"
                          className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 transition hover:border-red-200 hover:bg-red-100"
                        >
                          <LuTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PARCEL DETAIL MODAL */}
      {detailParcel && (
        <ParcelDetailModal
          parcel={detailParcel}
          onClose={() => setDetailParcel(null)}
        />
      )}
    </div>
  );
};

export default MyParcels;
