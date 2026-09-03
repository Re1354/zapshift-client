import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  FaCheck,
  FaClock,
  FaMotorcycle,
  FaTimes,
  FaUsers,
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ApproveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // =========================================================
  // GET RIDERS
  // =========================================================
  const {
    data: riders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['riders'],
    queryFn: async () => {
      const res = await axiosSecure.get('/riders');

      return Array.isArray(res.data) ? res.data : res.data?.riders || [];
    },
  });

  // =========================================================
  // UPDATE RIDER STATUS
  // =========================================================
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, email }) => {
      const res = await axiosSecure.patch(`/riders/${id}`, {
        status,
        email,
      });

      return res.data;
    },

    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['riders'],
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data?.message || 'Rider status has been updated successfully.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    },

    onError: error => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text:
          error?.response?.data?.message ||
          'Failed to update rider status. Please try again.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
      });
    },
  });

  // =========================================================
  // APPROVE RIDER
  // =========================================================
  const handleApprove = rider => {
    Swal.fire({
      title: 'Approve Rider?',
      text: `Are you sure you want to approve ${rider.name}?`,
      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',

      confirmButtonColor: '#c6ef52',
      cancelButtonColor: '#e5e7eb',

      color: '#003b40',

      reverseButtons: true,

      customClass: {
        popup: 'rounded-2xl',
        title: 'text-[#003b40]',
        confirmButton: 'rounded-lg font-semibold text-black',
        cancelButton: 'rounded-lg font-semibold text-gray-700',
      },
    }).then(result => {
      if (result.isConfirmed) {
        statusMutation.mutate({
          id: rider._id,
          status: 'approved',
        });
      }
    });
  };

  // =========================================================
  // REJECT RIDER
  // =========================================================
  const handleReject = rider => {
    Swal.fire({
      title: 'Reject Rider?',
      text: `Are you sure you want to reject ${rider.name}'s application?`,
      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Reject',
      cancelButtonText: 'Cancel',

      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#e5e7eb',

      color: '#003b40',

      reverseButtons: true,

      customClass: {
        popup: 'rounded-2xl',
        title: 'text-[#003b40]',
        confirmButton: 'rounded-lg font-semibold',
        cancelButton: 'rounded-lg font-semibold text-gray-700',
      },
    }).then(result => {
      if (result.isConfirmed) {
        statusMutation.mutate({
          id: rider._id,
          status: 'rejected',
        });
      }
    });
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eef0f1] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex min-h-[450px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-[#003b40]" />

              <p className="mt-4 text-sm text-gray-500">
                Loading rider applications...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (isError) {
    return (
      <div className="min-h-screen bg-[#eef0f1] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex min-h-[450px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="max-w-md px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <FaTimes className="text-xl" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#003b40]">
                Failed to Load Riders
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {error?.response?.data?.message ||
                  'Something went wrong while loading rider applications.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // STATISTICS
  // =========================================================
  const totalRiders = riders.length;

  const pendingRiders = riders.filter(
    rider => rider.status === 'pending',
  ).length;

  const approvedRiders = riders.filter(
    rider => rider.status === 'approved',
  ).length;

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="min-h-screen bg-[#eef0f1] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-7 flex items-center justify-between px-2 md:px-4">
          <div>
            <h1 className="text-[28px] font-bold leading-tight text-[#003b40] md:text-[32px]">
              Approve Riders
            </h1>

            <p className="mt-1.5 text-[13px] text-[#718096]">
              Review rider applications and manage rider approvals.
            </p>
          </div>

          <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#c6ef52] text-[#003b40] sm:flex">
            <FaMotorcycle className="text-lg" />
          </div>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* TOTAL */}
          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">
                  Total Applications
                </p>

                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#003b40]">
                  {totalRiders}
                </h2>

                <p className="mt-2 text-[11px] text-gray-400">
                  All rider applications
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef8d5] text-[#003b40]">
                <FaUsers className="text-lg" />
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">
                  Pending Applications
                </p>

                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#d88900]">
                  {pendingRiders}
                </h2>

                <p className="mt-2 text-[11px] text-gray-400">
                  Waiting for review
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff5d6] text-[#d88900]">
                <FaClock className="text-lg" />
              </div>
            </div>
          </div>

          {/* APPROVED */}
          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">
                  Approved Riders
                </p>

                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#16a34a]">
                  {approvedRiders}
                </h2>

                <p className="mt-2 text-[11px] text-gray-400">
                  Active approved riders
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f8ed] text-[#16a34a]">
                <FaCheck className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIDER APPLICATIONS
        ====================================================== */}
        <div className="w-full overflow-hidden rounded-xl border border-[#dfe4e6] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          {/* ===================================================
              CARD HEADER
          ==================================================== */}
          <div className="flex items-center justify-between border-b border-[#e9edef] px-7 py-5 md:px-8">
            <div>
              <h2 className="text-[18px] font-bold text-[#003b40]">
                Rider Applications
              </h2>

              <p className="mt-1 text-[12px] text-gray-500">
                Review and manage rider applications.
              </p>
            </div>

            <div className="rounded-full bg-[#f4f7f7] px-4 py-2">
              <span className="text-[12px] font-semibold text-[#003b40]">
                {pendingRiders} Pending
              </span>
            </div>
          </div>

          {/* ===================================================
              TABLE
          ==================================================== */}
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed">
              {/* ================= TABLE HEADER ================= */}
              <thead>
                <tr className="border-b border-[#e9edef] bg-[#fafbfb] text-left">
                  {/* # */}
                  <th className="w-[4%] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    #
                  </th>

                  {/* RIDER */}
                  <th className="w-[17%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Rider
                  </th>

                  {/* CONTACT */}
                  <th className="w-[17%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Contact
                  </th>

                  {/* LOCATION */}
                  <th className="w-[10%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Location
                  </th>

                  {/* LICENSE */}
                  <th className="w-[9%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    License
                  </th>

                  {/* BIKE */}
                  <th className="w-[10%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Bike
                  </th>

                  {/* STATUS */}
                  <th className="w-[9%] px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Status
                  </th>

                  {/* WORK STATUS */}
                  <th className="w-[12%] whitespace-nowrap px-2 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Work Status
                  </th>

                  {/* ACTION */}
                  <th className="w-[12%] px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                    Action
                  </th>
                </tr>
              </thead>

              {/* ================= TABLE BODY ================= */}
              <tbody>
                {riders.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="flex min-h-[280px] flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f5] text-[#003b40]">
                          <FaMotorcycle className="text-2xl" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-[#003b40]">
                          No Rider Applications
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          There are currently no rider applications.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  riders.map((rider, index) => {
                    const riderInitial = rider.name
                      ? rider.name.charAt(0).toUpperCase()
                      : 'R';

                    return (
                      <tr
                        key={rider._id}
                        className="border-b border-[#edf0f2] transition duration-200 last:border-b-0 hover:bg-[#fbfcfc]"
                      >
                        {/* ================= NUMBER ================= */}
                        <td className="px-4 py-5">
                          <span className="text-[12px] font-medium text-gray-500">
                            {index + 1}
                          </span>
                        </td>

                        {/* ================= RIDER ================= */}
                        <td className="px-2 py-5">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c6ef52] text-[13px] font-bold text-[#003b40]">
                              {riderInitial}
                            </div>

                            <div className="min-w-0">
                              <p
                                className="truncate text-[12px] font-bold text-[#003b40]"
                                title={rider.name}
                              >
                                {rider.name}
                              </p>

                              <p
                                className="mt-1 truncate text-[10px] text-gray-500"
                                title={rider.nid}
                              >
                                NID: {rider.nid}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ================= CONTACT ================= */}
                        <td className="px-2 py-5">
                          <p
                            className="truncate text-[11px] font-medium text-[#4a5568]"
                            title={rider.email}
                          >
                            {rider.email}
                          </p>

                          <p
                            className="mt-1 truncate text-[10px] text-gray-500"
                            title={rider.phone}
                          >
                            {rider.phone}
                          </p>
                        </td>

                        {/* ================= LOCATION ================= */}
                        <td className="px-2 py-5">
                          <p
                            className="truncate text-[11px] font-semibold text-[#4a5568]"
                            title={rider.region}
                          >
                            {rider.region}
                          </p>

                          <p
                            className="mt-1 truncate text-[10px] text-gray-500"
                            title={rider.district}
                          >
                            {rider.district}
                          </p>
                        </td>

                        {/* ================= LICENSE ================= */}
                        <td className="px-2 py-5">
                          <p
                            className="truncate text-[11px] font-medium text-[#4a5568]"
                            title={rider.licenseNumber}
                          >
                            {rider.licenseNumber}
                          </p>
                        </td>

                        {/* ================= BIKE ================= */}
                        <td className="px-2 py-5">
                          <p
                            className="truncate text-[11px] font-semibold text-[#4a5568]"
                            title={rider.bikeModel}
                          >
                            {rider.bikeModel}
                          </p>

                          <p
                            className="mt-1 truncate text-[10px] text-gray-500"
                            title={rider.bikeRegistration}
                          >
                            {rider.bikeRegistration}
                          </p>
                        </td>

                        {/* ================= STATUS ================= */}
                        <td className="px-2 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-bold capitalize ${
                              rider.status === 'approved'
                                ? 'bg-[#e8f8ed] text-[#16a34a]'
                                : rider.status === 'rejected'
                                  ? 'bg-[#fff0f0] text-[#dc2626]'
                                  : 'bg-[#fff5d6] text-[#d88900]'
                            }`}
                          >
                            {rider.status}
                          </span>
                        </td>

                        {/* ================= WORK STATUS ================= */}
                        <td className="px-2 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-bold capitalize ${
                              rider.workStatus === 'available'
                                ? 'bg-[#eef8f1] text-[#16a34a]'
                                : rider.workStatus === 'assigned'
                                  ? 'bg-[#e8f1ff] text-[#2563eb]'
                                  : rider.workStatus === 'in-progress'
                                    ? 'bg-[#fff5d6] text-[#d88900]'
                                    : rider.workStatus === 'completed'
                                      ? 'bg-[#e8f8ed] text-[#16a34a]'
                                      : rider.workStatus === 'cancelled'
                                        ? 'bg-[#fff0f0] text-[#dc2626]'
                                        : 'bg-[#f1f5f5] text-[#718096]'
                            }`}
                          >
                            {rider.workStatus || 'Not Assigned'}
                          </span>
                        </td>

                        {/* ================= ACTION ================= */}
                        <td className="px-4 py-5">
                          {rider.status === 'pending' ? (
                            <div className="flex items-center justify-start gap-1.5">
                              {/* APPROVE */}
                              <button
                                type="button"
                                onClick={() => handleApprove(rider)}
                                disabled={statusMutation.isPending}
                                title={`Approve ${rider.name}`}
                                aria-label={`Approve ${rider.name}`}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c6ef52] text-[#003b40] shadow-sm transition-all duration-200 hover:bg-[#b9e83e] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaCheck className="text-[11px]" />
                              </button>

                              {/* REJECT */}
                              <button
                                type="button"
                                onClick={() => handleReject(rider)}
                                disabled={statusMutation.isPending}
                                title={`Reject ${rider.name}`}
                                aria-label={`Reject ${rider.name}`}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 shadow-sm transition-all duration-200 hover:bg-red-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaTimes className="text-[11px]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-start">
                              <span
                                title="Completed"
                                aria-label="Completed"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f5] text-[#94a3b8]"
                              >
                                <FaCheck className="text-[11px]" />
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRiders;
