import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaMotorcycle, FaUserShield, FaUsers } from 'react-icons/fa';
import { LuSearch, LuX } from 'react-icons/lu';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Search + pagination state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search so the backend is not called on every keystroke
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 100);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================================
  // GET USERS
  // =========================================================
  const {
    data: userData = {},
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', page, debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get('/users', {
        params: { page, limit, search: debouncedSearch },
      });
      return res.data || {};
    },
    placeholderData: previousData => previousData,
  });

  const users = userData.users || [];
  const totalUsers = userData.totalUsers || 0;
  const riderUsers = userData.riderUsers || 0;
  const adminUsers = userData.adminUsers || 0;
  const totalPages = userData.totalPages || 1;

  const filteredUsers = users;

  // =========================================================
  // MAKE ADMIN
  // =========================================================
  const makeAdminMutation = useMutation({
    mutationFn: async user => {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, {
        role: 'admin',
      });
      return res.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data?.message || 'User has been promoted to admin successfully.',
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
          'Could not make this user an admin.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
      });
    },
  });

  // =========================================================
  // REMOVE ADMIN
  // =========================================================
  const removeAdminMutation = useMutation({
    mutationFn: async user => {
      const res = await axiosSecure.patch(`/users/${user._id}/role`, {
        role: 'user',
      });
      return res.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data?.message || 'Admin role has been removed successfully.',
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
        text: error?.response?.data?.message || 'Could not remove admin role.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
      });
    },
  });

  // =========================================================
  // MAKE ADMIN CONFIRMATION
  // =========================================================
  const handleMakeAdmin = user => {
    Swal.fire({
      title: 'Make Admin?',
      text: `Are you sure you want to make ${user.displayName || 'this user'} an admin?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Make Admin',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#c6ef52',
      cancelButtonColor: '#e5e7eb',
      color: '#003b40',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg font-semibold text-black',
        cancelButton: 'rounded-lg font-semibold text-gray-700',
      },
    }).then(result => {
      if (result.isConfirmed) makeAdminMutation.mutate(user);
    });
  };

  // =========================================================
  // REMOVE ADMIN CONFIRMATION
  // =========================================================
  const handleRemoveAdmin = user => {
    Swal.fire({
      title: 'Remove Admin?',
      text: `Are you sure you want to remove admin access from ${user.displayName || 'this user'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove Admin',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#e5e7eb',
      color: '#003b40',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg font-semibold text-white',
        cancelButton: 'rounded-lg font-semibold text-gray-700',
      },
    }).then(result => {
      if (result.isConfirmed) removeAdminMutation.mutate(user);
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
              <p className="mt-4 text-sm text-gray-500">Loading users...</p>
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
                <FaUsers className="text-xl" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#003b40]">
                Failed to Load Users
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {error?.response?.data?.message ||
                  'Something went wrong while loading users.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="min-h-screen bg-[#eef0f1] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* HEADER */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold leading-tight text-[#003b40] md:text-[32px]">
              Users Management
            </h1>
            <p className="mt-1.5 text-[13px] text-[#718096]">
              View and manage all registered users.
            </p>
          </div>
          <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#c6ef52] text-[#003b40] sm:flex">
            <FaUsers className="text-lg" />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">
                  Total Users
                </p>
                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#003b40]">
                  {totalUsers}
                </h2>
                <p className="mt-2 text-[11px] text-gray-400">
                  All registered users
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef8d5] text-[#003b40]">
                <FaUsers className="text-lg" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">Riders</p>
                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#16a34a]">
                  {riderUsers}
                </h2>
                <p className="mt-2 text-[11px] text-gray-400">
                  Approved riders
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f8ed] text-[#16a34a]">
                <FaMotorcycle className="text-lg" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e1e5e7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#718096]">Admins</p>
                <h2 className="mt-2 text-[30px] font-bold leading-none text-[#7c3aed]">
                  {adminUsers}
                </h2>
                <p className="mt-2 text-[11px] text-gray-400">
                  System administrators
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1eafd] text-[#7c3aed]">
                <FaUserShield className="text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="w-full overflow-hidden rounded-xl border border-[#dfe4e6] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          {/* Card Header + Search */}
          <div className="flex flex-col gap-4 border-b border-[#e9edef] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <h2 className="text-[18px] font-bold text-[#003b40]">
                All Users
              </h2>
              <p className="mt-1 text-[12px] text-gray-500">
                View registered users and manage user accounts.
              </p>
            </div>

            {/* ✅ Search Input */}
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-72">
                <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="h-10 w-full rounded-lg border border-[#d6dde2] bg-[#fafbfb] pl-9 pr-9 text-[13px] text-[#003b40] outline-none transition focus:border-[#c6ef52] focus:ring-2 focus:ring-[#c6ef52]/20 placeholder:text-gray-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <LuX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="shrink-0 rounded-full bg-[#f4f7f7] px-4 py-2">
                <span className="text-[12px] font-semibold text-[#003b40]">
                  {totalUsers === 0 ? 0 : (page - 1) * limit + 1}-
                  {Math.min(page * limit, totalUsers)} / {totalUsers}
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-[#e9edef] bg-[#fafbfb] text-left">
                  <th className="w-[5%] px-4 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096] lg:px-5">
                    #
                  </th>
                  <th className="w-[22%] px-3 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                    User
                  </th>
                  <th className="w-[27%] px-3 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                    Email
                  </th>
                  <th className="w-[13%] px-3 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                    Role
                  </th>
                  <th className="w-[15%] px-3 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                    Joined
                  </th>
                  <th className="w-[18%] px-3 py-4 text-[12px] font-semibold uppercase tracking-wide text-[#718096]">
                    Admin Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* ✅ No results from search */}
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="flex min-h-[280px] flex-col items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f5]">
                          <LuSearch className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-[#003b40]">
                          {search ? 'No results found' : 'No Users Found'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {search
                            ? `No users match "${search}"`
                            : 'There are currently no registered users.'}
                        </p>
                        {search && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch('');
                              setPage(1);
                            }}
                            className="mt-4 rounded-lg bg-[#c6ef52] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#b9e83e]"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ✅ Use filteredUsers instead of users */
                  filteredUsers.map((user, index) => {
                    const userInitial = user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : 'U';

                    return (
                      <tr
                        key={user._id}
                        className="border-b border-[#edf0f2] transition duration-200 last:border-b-0 hover:bg-[#fbfcfc]"
                      >
                        {/* NUMBER */}
                        <td className="px-4 py-5 lg:px-5">
                          <span className="text-[13px] font-medium text-gray-500">
                            {(page - 1) * limit + index + 1}
                          </span>
                        </td>

                        {/* USER */}
                        <td className="px-3 py-5">
                          <div className="flex min-w-0 items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c6ef52] text-[14px] font-bold text-[#003b40]">
                                {userInitial}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p
                                className="truncate text-[14px] font-bold text-[#003b40]"
                                title={user.displayName}
                              >
                                {user.displayName || 'Unknown User'}
                              </p>
                              <p className="mt-1 truncate text-[11px] text-gray-500">
                                Registered User
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-3 py-5">
                          <p
                            className="truncate text-[13px] font-medium text-[#4a5568]"
                            title={user.email}
                          >
                            {user.email}
                          </p>
                        </td>

                        {/* ROLE */}
                        <td className="px-3 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                              user.role === 'admin'
                                ? 'bg-[#f1eafd] text-[#7c3aed]'
                                : user.role === 'rider'
                                  ? 'bg-[#e8f8ed] text-[#16a34a]'
                                  : 'bg-[#eef4ff] text-[#2563eb]'
                            }`}
                          >
                            {user.role || 'user'}
                          </span>
                        </td>

                        {/* JOINED */}
                        <td className="px-3 py-5">
                          <p className="text-[13px] font-medium text-[#4a5568]">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  'en-GB',
                                )
                              : 'N/A'}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleTimeString(
                                  'en-US',
                                  {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  },
                                )
                              : ''}
                          </p>
                        </td>

                        {/* ADMIN ACTIONS */}
                        <td className="px-3 py-5">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            {user.role === 'admin' ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveAdmin(user)}
                                disabled={removeAdminMutation.isPending}
                                className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-[12px] font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {removeAdminMutation.isPending
                                  ? 'Removing...'
                                  : 'Remove Admin'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMakeAdmin(user)}
                                disabled={makeAdminMutation.isPending}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-[#c6ef52] px-3 text-[12px] font-semibold text-black transition hover:bg-[#b9e83e] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {makeAdminMutation.isPending
                                  ? 'Updating...'
                                  : 'Make Admin'}
                              </button>
                            )}
                            <button
                              type="button"
                              className="inline-flex h-9 items-center justify-center rounded-md border border-[#d6dde2] bg-white px-3 text-[12px] font-semibold text-[#003b40] transition hover:bg-[#f4f7f7]"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#e9edef] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="text-[12px] text-gray-500">
                Page{' '}
                <span className="font-semibold text-[#003b40]">{page}</span> of{' '}
                <span className="font-semibold text-[#003b40]">
                  {totalPages}
                </span>
                {isFetching && (
                  <span className="ml-2 text-[#003b40]">Updating...</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isFetching}
                  className="rounded-lg border border-[#d6dde2] bg-white px-3 py-2 text-[12px] font-semibold text-[#003b40] transition hover:bg-[#f4f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      pageNumber =>
                        totalPages <= 5 ||
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - page) <= 1,
                    )
                    .map((pageNumber, index, visiblePages) => {
                      const previousPageNumber = visiblePages[index - 1];
                      const showDots =
                        previousPageNumber &&
                        pageNumber - previousPageNumber > 1;
                      return (
                        <React.Fragment key={pageNumber}>
                          {showDots && (
                            <span className="px-1 text-gray-400">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            disabled={isFetching}
                            className={`h-8 min-w-8 rounded-lg px-2 text-[12px] font-semibold transition ${page === pageNumber ? 'bg-[#c6ef52] text-black' : 'border border-[#d6dde2] bg-white text-[#003b40] hover:bg-[#f4f7f7]'} disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {pageNumber}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages || isFetching}
                  className="rounded-lg border border-[#d6dde2] bg-white px-3 py-2 text-[12px] font-semibold text-[#003b40] transition hover:bg-[#f4f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
