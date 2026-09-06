import React from 'react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const Profile = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const getRoleBadge = (r) => {
    switch (r) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            Admin
          </span>
        );
      case 'rider':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Delivery Rider
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Customer / User
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-gray-100 sm:h-24 sm:w-24">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-secondary/60">
                  {user?.displayName?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-secondary sm:text-2xl">
                  {user?.displayName || 'ZapShift Member'}
                </h1>
                {getRoleBadge(role)}
              </div>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400">
                Member since:{' '}
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-col">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-secondary transition hover:brightness-95"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Account Details */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
            Account Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
              <span className="text-gray-500">Full Name</span>
              <span className="font-semibold text-secondary">
                {user?.displayName || 'Not provided'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
              <span className="text-gray-500">Email Address</span>
              <span className="font-semibold text-secondary">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
              <span className="text-gray-500">Email Verified</span>
              <span className="font-semibold text-emerald-600">
                {user?.emailVerified ? 'Verified' : 'Active (OAuth/Email)'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
              <span className="text-gray-500">Assigned Role</span>
              <span className="font-semibold capitalize text-secondary">{role}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-500">Account Status</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Quick Role Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {role === 'user' && (
              <>
                <Link
                  to="/send-parcel"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Create New Shipment</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
                <Link
                  to="/dashboard/my-parcels"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>View My Parcels</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
                <Link
                  to="/dashboard/payment-history"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Payment History</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
              </>
            )}

            {role === 'rider' && (
              <>
                <Link
                  to="/dashboard/assigned-deliveries"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Assigned Deliveries</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
                <Link
                  to="/dashboard/completed-deliveries"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Completed Deliveries</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
              </>
            )}

            {role === 'admin' && (
              <>
                <Link
                  to="/dashboard/approve-riders"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Rider Applications</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
                <Link
                  to="/dashboard/users-management"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Users & Roles Management</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
                <Link
                  to="/dashboard/assign-riders"
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
                >
                  <span>Assign Riders to Parcels</span>
                  <span className="text-primary font-bold">→</span>
                </Link>
              </>
            )}

            <Link
              to="/parcel-track"
              className="flex items-center justify-between rounded-xl border border-gray-100 p-3 text-sm font-semibold text-secondary transition hover:border-primary hover:bg-primary/5"
            >
              <span>Track Any Shipment</span>
              <span className="text-primary font-bold">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
