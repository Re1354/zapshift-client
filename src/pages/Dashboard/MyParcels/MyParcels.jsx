import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: parcels = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
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
      console.log('Delete error:', error);

      Swal.fire({
        title: 'Something went wrong',
        text: 'Failed to delete the parcel.',
        icon: 'error',
        confirmButtonColor: '#202020',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl',
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <p className="font-medium text-red-500">Failed to load parcels</p>

        <p className="mt-1 text-sm text-gray-500">
          {error?.message || 'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
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

      {/* Empty State */}
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
            <table className="w-full min-w-[1200px] text-left">
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

                  {/* Sender removed */}

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Receiver
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

                  {/* New Delivery Status column */}
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
                    {/* Parcel */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-secondary">
                        {parcel.parcelName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        #{parcel._id?.slice(-6)}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                        {parcel.parcelType}
                      </span>
                    </td>

                    {/* Weight */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        {parcel.parcelWeight} KG
                      </span>
                    </td>

                    {/* Sender removed */}

                    {/* Receiver */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-secondary">
                        {parcel.receiverName}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {parcel.receiverDistrict}
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

                    {/* Date */}
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

                    {/* Payment */}
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
                          Pay
                        </button>
                      )}
                    </td>

                    {/* Delivery Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          parcel.deliveryStatus === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : parcel.deliveryStatus === 'in_transit'
                              ? 'bg-blue-100 text-blue-700'
                              : parcel.deliveryStatus === 'picked_up'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {parcel.deliveryStatus
                          ? parcel.deliveryStatus.replace(/_/g, ' ')
                          : 'Pending'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/parcels/${parcel._id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xs border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-secondary transition hover:border-secondary/30 hover:bg-gray-50"
                        >
                          <LuEye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/dashboard/update-parcel/${parcel._id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xs bg-primary px-3 py-1.5 text-xs font-semibold text-secondary transition hover:brightness-95"
                        >
                          <LuPencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(parcel._id)}
                          className="inline-flex items-center gap-1.5 rounded-xs border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-100"
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
    </div>
  );
};

export default MyParcels;
