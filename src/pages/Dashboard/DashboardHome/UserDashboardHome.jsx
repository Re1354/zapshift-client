import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuClock3,
  LuCreditCard,
  LuArrowUpRight,
  LuPlus,
  LuSearch,
  LuCopy,
  LuEye,
  LuX,
  LuTrendingUp,
  LuMapPin,
  LuShieldAlert,
} from 'react-icons/lu';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

/* ============================================================
   STATUS CONFIGURATION
============================================================ */
const STATUS_CONFIG = [
  {
    key: 'pending-pickup',
    label: 'Pending Pickup',
    shortLabel: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    chart: '#f59e0b',
  },
  {
    key: 'driver-assigned',
    label: 'Driver Assigned',
    shortLabel: 'Assigned',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    chart: '#3b82f6',
  },
  {
    key: 'driver-accepted',
    label: 'Driver Accepted',
    shortLabel: 'Accepted',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    chart: '#8b5cf6',
  },
  {
    key: 'picked-up',
    label: 'Picked Up',
    shortLabel: 'Picked Up',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    dot: 'bg-cyan-500',
    chart: '#06b6d4',
  },
  {
    key: 'in-transit',
    label: 'In Transit',
    shortLabel: 'In Transit',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    dot: 'bg-indigo-500',
    chart: '#6366f1',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    bg: 'bg-[#f2f8df]',
    text: 'text-[#6c861f]',
    dot: 'bg-[#7c9825]',
    chart: '#7c9825',
  },
  {
    key: 'driver-rejected',
    label: 'Driver Rejected',
    shortLabel: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    chart: '#ef4444',
  },
];

/* Helper for delivery status classes */
const getDeliveryStatusBadge = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-[#f2f8df] text-[#6c861f] border-[#d8ebb5]';
    case 'in-transit':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'picked-up':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'driver-accepted':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'driver-assigned':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'pending-pickup':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'driver-rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

/* ============================================================
   PARCEL DETAIL MODAL
============================================================ */
const ParcelDetailModal = ({ parcel, onClose, onTrack, onPay }) => {
  if (!parcel) return null;

  const DetailField = ({ label, value }) => (
    <div>
      <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#003b40] break-words">
        {value || '—'}
      </p>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#003b40] text-[#c6ef52]">
              <LuPackage className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base sm:text-lg font-bold text-[#003b40]">
                {parcel.parcelName || 'Unnamed Parcel'}
              </h3>
              <p className="truncate font-mono text-[11px] sm:text-xs text-gray-400">
                {parcel.trackingId ? `ID: ${parcel.trackingId}` : `Ref: #${parcel._id?.slice(-8)}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold capitalize border ${getDeliveryStatusBadge(
                parcel.deliveryStatus
              )}`}
            >
              {parcel.deliveryStatus ? parcel.deliveryStatus.replace(/-/g, ' ') : 'Pending'}
            </span>
            <span
              className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold ${parcel.paymentStatus === 'paid'
                  ? 'bg-[#f2f8df] text-[#6c861f]'
                  : 'bg-amber-100 text-amber-800'
                }`}
            >
              {parcel.paymentStatus === 'paid' ? 'Payment: Paid' : 'Payment: Unpaid'}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium capitalize text-gray-600">
              Type: {parcel.parcelType || 'Standard'}
            </span>
          </div>

          {/* Parcel Info */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 sm:p-4">
            <p className="mb-2.5 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
              Parcel Details
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              <DetailField label="Parcel Name" value={parcel.parcelName} />
              <DetailField label="Weight" value={parcel.parcelWeight ? `${parcel.parcelWeight} kg` : null} />
              <DetailField label="Shipping Cost" value={parcel.cost ? `৳${parcel.cost}` : null} />
              <DetailField
                label="Booked On"
                value={
                  parcel.createdAt
                    ? new Date(parcel.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    : null
                }
              />
              <DetailField label="Payment Status" value={parcel.paymentStatus?.toUpperCase()} />
              {parcel.trackingId && (
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    Tracking ID
                  </p>
                  <p className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-[#003b40]">
                    {parcel.trackingId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sender & Receiver Info */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 sm:p-4">
              <p className="mb-2.5 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Sender Info
              </p>
              <div className="space-y-2 sm:space-y-2.5">
                <DetailField label="Name" value={parcel.senderName} />
                <DetailField label="Phone" value={parcel.senderPhone} />
                <DetailField
                  label="Region / District"
                  value={`${parcel.senderRegion || ''} ${parcel.senderDistrict ? `(${parcel.senderDistrict})` : ''}`}
                />
                <DetailField label="Address" value={parcel.senderAddress} />
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 sm:p-4">
              <p className="mb-2.5 sm:mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Receiver Info
              </p>
              <div className="space-y-2 sm:space-y-2.5">
                <DetailField label="Name" value={parcel.receiverName} />
                <DetailField label="Phone" value={parcel.receiverPhone} />
                <DetailField
                  label="Region / District"
                  value={`${parcel.receiverRegion || ''} ${parcel.receiverDistrict ? `(${parcel.receiverDistrict})` : ''}`}
                />
                <DetailField label="Address" value={parcel.receiverAddress} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-gray-200 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-600 transition hover:bg-gray-50 text-center"
          >
            Close
          </button>
          {parcel.paymentStatus !== 'paid' && (
            <button
              type="button"
              onClick={() => onPay(parcel._id)}
              className="w-full sm:w-auto rounded-xl bg-[#c6ef52] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#003b40] transition hover:brightness-95 text-center"
            >
              Pay Now (৳{parcel.cost || 0})
            </button>
          )}
          {parcel.trackingId && (
            <button
              type="button"
              onClick={() => onTrack(parcel.trackingId)}
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#003b40] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#004f56]"
            >
              <span>Track Live</span>
              <LuArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN USER DASHBOARD HOME COMPONENT
============================================================ */
const UserDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [trackSearchId, setTrackSearchId] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);

  /* Query user stats from backend */
  const {
    data: statsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-dashboard-stats', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/user-stats');
      return res.data;
    },
  });

  /* Extract metrics with safe defaults */
  const totalParcels = Number(statsData?.totalParcels || 0);
  const deliveredCount = Number(statsData?.deliveredCount || 0);
  const inTransitCount = Number(statsData?.inTransitCount || 0);
  const totalSpent = Number(statsData?.totalSpent || 0);
  const paidCount = Number(statsData?.paidCount || 0);
  const unpaidCount = Number(statsData?.unpaidCount || 0);
  const deliveryRate = Number(statsData?.deliveryRate || 0);
  const statusCounts = statsData?.statusCounts || {};
  const monthlyTrends = statsData?.monthlyTrends || [];
  const recentParcels = statsData?.recentParcels || [];

  /* Prepare Pie/Donut Data */
  const chartData = STATUS_CONFIG.map((status) => ({
    name: status.shortLabel,
    fullName: status.label,
    value: Number(statusCounts[status.key] || 0),
    color: status.chart,
  })).filter((item) => item.value > 0);

  /* Prepare Monthly Bar Chart Data */
  const barData = monthlyTrends.map((m) => ({
    name: m.displayMonth || m.month,
    parcels: m.parcels || 0,
    spend: m.spend || 0,
  }));

  /* Copy Tracking ID helper */
  const handleCopyTracking = (trackingId) => {
    if (!trackingId) return;
    navigator.clipboard.writeText(trackingId);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Tracking ID copied!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  /* Quick Track Search Handler */
  const handleTrackSearch = (e) => {
    e.preventDefault();
    const cleanId = trackSearchId.trim();
    if (!cleanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please enter a Tracking ID',
        text: 'Enter your parcel tracking number to check its real-time progress.',
        confirmButtonColor: '#003b40',
      });
      return;
    }
    navigate(`/parcel-track/${cleanId}`);
  };

  /* Loading State */
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] sm:min-h-[65vh] flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg text-[#003b40]" />
        <p className="text-xs sm:text-sm font-medium text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  /* Error State */
  if (isError) {
    return (
      <div className="rounded-2xl sm:rounded-[28px] border border-red-100 bg-white p-6 sm:p-10 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <LuShieldAlert className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h2 className="mt-4 sm:mt-5 text-lg sm:text-xl font-bold text-[#003b40]">
          Unable to load dashboard data
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
          There was an issue fetching your account statistics. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-xl bg-[#003b40] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#004e54]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-5 sm:space-y-6 lg:space-y-7 pb-8 sm:pb-10">
      {/* ============================================================
          HEADER & WELCOME BANNER
      ============================================================ */}
      <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#7c9825]">
              Customer Dashboard
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c9825]" />
            <span className="text-[11px] sm:text-xs font-semibold text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="mt-1.5 sm:mt-2 text-2xl font-bold tracking-tight text-[#003b40] sm:text-3xl md:text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6 max-w-xl">
            Monitor your booked parcels, real-time shipment status, and delivery milestones.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <Link
            to="/send-parcel"
            className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#caea3e] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[#003b40] shadow-xs transition hover:brightness-95"
          >
            <LuPlus className="h-4 w-4 stroke-[2.5]" />
            <span>Send A Parcel</span>
          </Link>

          <Link
            to="/dashboard/my-parcels"
            className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-[#003b40] shadow-xs transition hover:bg-gray-50"
          >
            <LuPackage className="h-4 w-4 text-gray-500" />
            <span>My Parcels</span>
          </Link>
        </div>
      </div>

      {/* ============================================================
          QUICK TRACKING SEARCH CARD
      ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[26px] border border-[#e3ebed] bg-gradient-to-r from-white via-white to-[#f4f8f8] p-4 sm:p-5 md:p-6 shadow-xs">
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#003b40] text-[#c6ef52]">
              <LuSearch className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#003b40]">
                Quick Parcel Tracking
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-4 sm:leading-normal">
                Enter your Tracking ID to view the live timeline and driver status instantly.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleTrackSearch}
            className="flex w-full items-center gap-2 lg:max-w-md"
          >
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                value={trackSearchId}
                onChange={(e) => setTrackSearchId(e.target.value)}
                placeholder="e.g. PRCL-17412345"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono text-xs font-medium text-gray-800 transition placeholder:font-sans placeholder:text-gray-400 focus:border-[#003b40] focus:outline-none focus:ring-1 focus:ring-[#003b40]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#003b40] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white transition hover:bg-[#004f56]"
            >
              <span>Track</span>
              <LuArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ============================================================
          TOP 4 KPI STAT CARDS
      ============================================================ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        {/* 1. Total Parcels (Hero Dark Teal) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[26px] bg-[#003b40] p-4.5 sm:p-5 md:p-6 shadow-xs">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#c6ef52]/10 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-[#c9d9da]">
                Total Bookings
              </p>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#c6ef52] text-[#003b40]">
                <LuPackage className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <h2 className="mt-3 sm:mt-5 text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {totalParcels}
            </h2>
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs text-[#a9c0c2]">
              <span>All lifetime shipments</span>
              <span className="font-semibold text-[#c6ef52]">Active Account</span>
            </div>
          </div>
        </div>

        {/* 2. Active Shipments */}
        <div className="rounded-2xl sm:rounded-[26px] border border-gray-100 bg-white p-4.5 sm:p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <LuTruck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            {inTransitCount > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-indigo-600">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-pulse rounded-full bg-indigo-500" />
                Live Moving
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-gray-300" />
            )}
          </div>
          <p className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-gray-500">Active Shipments</p>
          <h2 className="mt-1 text-2.5xl sm:text-3xl font-bold text-[#003b40] tracking-tight">
            {inTransitCount}
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-400">
            {inTransitCount > 0 ? 'Parcels currently on the road' : 'No active deliveries right now'}
          </p>
        </div>

        {/* 3. Delivered Shipments */}
        <div className="rounded-2xl sm:rounded-[26px] border border-gray-100 bg-white p-4.5 sm:p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#f2f8df] text-[#6c861f]">
              <LuCircleCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="rounded-full bg-[#f2f8df] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-[#6c861f]">
              {deliveryRate}% Rate
            </span>
          </div>
          <p className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-gray-500">Delivered</p>
          <h2 className="mt-1 text-2.5xl sm:text-3xl font-bold text-[#003b40] tracking-tight">
            {deliveredCount}
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-400">Successfully received parcels</p>
        </div>

        {/* 4. Total Delivery Spend */}
        <div className="rounded-2xl sm:rounded-[26px] border border-gray-100 bg-white p-4.5 sm:p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <LuCreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="rounded-full bg-gray-100 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-gray-600">
              {paidCount} Paid
            </span>
          </div>
          <p className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-gray-500">Total Shipping Cost</p>
          <h2 className="mt-1 text-2.5xl sm:text-3xl font-bold text-[#003b40] tracking-tight truncate">
            ৳{totalSpent.toLocaleString()}
          </h2>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs text-gray-400">
            <span>Spend on completed orders</span>
            {unpaidCount > 0 && (
              <span className="font-semibold text-amber-600">
                {unpaidCount} unpaid
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          ANALYTICS CHARTS SECTION
      ============================================================ */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-5">
        {/* BAR CHART: Monthly Booking Activity */}
        <div className="min-w-0 rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 md:p-7 shadow-xs xl:col-span-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#003b40]">
                  Booking History
                </h2>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                  Monthly Trends
                </span>
              </div>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
                Number of parcels booked over recent months.
              </p>
            </div>

            <div className="w-fit rounded-full bg-[#f4f7f7] px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#003b40]">
              {totalParcels} Total Bookings
            </div>
          </div>

          <div className="mt-6 sm:mt-8 h-[240px] sm:h-[300px] md:h-[310px] w-full min-w-0">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#edf1f1"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#718083',
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#718083',
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f5f7f7' }}
                    contentStyle={{
                      border: 'none',
                      borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0, 59, 64, 0.12)',
                    }}
                    formatter={(value, name) => [
                      name === 'spend' ? `৳${value}` : `${value} parcels`,
                      name === 'spend' ? 'Spend' : 'Parcels',
                    ]}
                  />
                  <Bar
                    dataKey="parcels"
                    fill="#003b40"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-[#fafbfb] p-4 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <LuTrendingUp className="h-5 w-5" />
                </div>
                <p className="mt-2.5 text-xs sm:text-sm font-semibold text-[#003b40]">
                  No monthly activity recorded yet
                </p>
                <p className="mt-1 max-w-xs text-[11px] sm:text-xs text-gray-400">
                  Once you book parcels, your monthly shipment statistics will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DONUT PIE CHART: Status Breakdown */}
        <div className="min-w-0 rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 md:p-7 shadow-xs xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#003b40]">
                Status Distribution
              </h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
                Current share of your parcel statuses.
              </p>
            </div>
          </div>

          <div className="relative mt-4 h-[240px] sm:h-[270px] md:h-[280px] w-full min-w-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: 'none',
                      borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0, 59, 64, 0.12)',
                    }}
                    formatter={(value, name, item) => [
                      `${value} parcels (${totalParcels > 0 ? Math.round((value / totalParcels) * 100) : 0}%)`,
                      item.payload.fullName || name,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={6}
                    wrapperStyle={{
                      fontSize: '10px',
                      color: '#647174',
                      paddingTop: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <div className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f2f8df] text-[#7c9825]">
                    <LuPackage className="h-5 w-5" />
                  </div>
                  <p className="mt-2.5 text-xs sm:text-sm font-semibold text-[#003b40]">
                    No status data
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-gray-400">
                    Status breakdown will appear when you book parcels.
                  </p>
                </div>
              </div>
            )}

            {/* Inner Center Label */}
            {chartData.length > 0 && (
              <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#003b40]">
                  {totalParcels}
                </p>
                <p className="text-[9px] sm:text-[10px] font-medium text-gray-400">Parcels</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          DELIVERY PIPELINE / STAGE CARDS
      ============================================================ */}
      <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 md:p-7 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#003b40]">
              Shipment Pipeline
            </h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
              Live breakdown of all stages in your parcel lifecycle.
            </p>
          </div>
          <span className="w-fit rounded-full bg-[#f2f8df] px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#6c861f]">
            {deliveryRate}% Successfully Delivered
          </span>
        </div>

        <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
          {STATUS_CONFIG.map((status) => {
            const count = Number(statusCounts[status.key] || 0);
            const percentage =
              totalParcels > 0 ? Math.round((count / totalParcels) * 100) : 0;

            return (
              <div
                key={status.key}
                className="rounded-xl sm:rounded-2xl border border-gray-100 bg-[#fafbfb] p-3 sm:p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full ${status.dot}`} />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-400">
                    {percentage}%
                  </span>
                </div>
                <p className="mt-2.5 sm:mt-4 text-[11px] sm:text-xs font-semibold leading-4 sm:leading-5 text-gray-500 truncate">
                  {status.label}
                </p>
                <p className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-[#003b40]">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          RECENT SHIPMENTS TABLE & MOBILE CARD LIST
      ============================================================ */}
      <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 md:p-7 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#003b40]">
              Recent Shipments
            </h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-500">
              Your latest bookings and delivery records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/my-parcels"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7c9825] transition hover:underline"
            >
              <span>View All Shipments</span>
              <LuArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {recentParcels.length > 0 ? (
          <>
            {/* Mobile Card List (320px - 639px) */}
            <div className="mt-4 space-y-3 sm:hidden">
              {recentParcels.map((parcel) => (
                <div
                  key={parcel._id}
                  className="rounded-xl border border-gray-100 bg-[#fafbfb] p-3.5 space-y-3 transition hover:bg-white hover:shadow-xs"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#003b40]">
                        <LuPackage className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#003b40]">
                          {parcel.parcelName || 'Parcel'}
                        </p>
                        <p className="text-[11px] capitalize text-gray-400">
                          {parcel.parcelType || 'Standard'} {parcel.parcelWeight ? `• ${parcel.parcelWeight}kg` : ''}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${getDeliveryStatusBadge(
                        parcel.deliveryStatus
                      )}`}
                    >
                      {parcel.deliveryStatus ? parcel.deliveryStatus.replace(/-/g, ' ') : 'Pending'}
                    </span>
                  </div>

                  {/* Card Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-gray-100 py-2.5">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Tracking ID</p>
                      {parcel.trackingId ? (
                        <div className="mt-0.5 flex items-center gap-1">
                          <Link
                            to={`/parcel-track/${parcel.trackingId}`}
                            className="font-mono text-[11px] font-semibold text-[#003b40] underline hover:text-[#7c9825]"
                          >
                            {parcel.trackingId}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopyTracking(parcel.trackingId)}
                            title="Copy"
                            className="text-gray-400 hover:text-[#003b40]"
                          >
                            <LuCopy className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-gray-400">Pending</span>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Destination</p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-gray-700">
                        {parcel.receiverDistrict || parcel.receiverRegion || '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Booking Date</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {parcel.createdAt
                          ? new Date(parcel.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                          : '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-semibold text-gray-400">Shipping Cost</p>
                      <p className="mt-0.5 text-xs font-bold text-[#003b40]">৳{parcel.cost || 0}</p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div>
                      {parcel.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center rounded-full bg-[#f2f8df] px-2.5 py-0.5 text-[11px] font-bold text-[#6c861f]">
                          Paid
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                          className="inline-flex items-center rounded-full bg-[#caea3e] px-2.5 py-0.5 text-[11px] font-bold text-[#003b40] transition hover:brightness-95"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {parcel.trackingId && (
                        <Link
                          to={`/parcel-track/${parcel.trackingId}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:bg-[#003b40] hover:text-white"
                        >
                          <LuTruck className="h-3 w-3" />
                          <span>Track</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedParcel(parcel)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 transition hover:bg-[#003b40] hover:text-white"
                      >
                        <LuEye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop Table View (>= 640px) */}
            <div className="mt-6 hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                    <th className="pb-3.5 pl-2 font-semibold">Parcel Info</th>
                    <th className="pb-3.5 font-semibold">Tracking ID</th>
                    <th className="pb-3.5 font-semibold">Destination</th>
                    <th className="pb-3.5 font-semibold">Date</th>
                    <th className="pb-3.5 font-semibold">Cost</th>
                    <th className="pb-3.5 font-semibold">Payment</th>
                    <th className="pb-3.5 font-semibold">Delivery Status</th>
                    <th className="pb-3.5 pr-2 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentParcels.map((parcel) => (
                    <tr
                      key={parcel._id}
                      className="transition hover:bg-[#fafbfb]"
                    >
                      {/* Parcel Name & Type */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[#003b40]">
                            <LuPackage className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-[#003b40]">
                              {parcel.parcelName || 'Parcel'}
                            </p>
                            <span className="text-[11px] capitalize text-gray-400">
                              {parcel.parcelType || 'Standard'} • {parcel.parcelWeight ? `${parcel.parcelWeight}kg` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tracking ID with Copy */}
                      <td className="py-4">
                        {parcel.trackingId ? (
                          <div className="flex items-center gap-1.5">
                            <Link
                              to={`/parcel-track/${parcel.trackingId}`}
                              className="font-mono text-xs font-semibold text-[#003b40] hover:text-[#7c9825] hover:underline"
                            >
                              {parcel.trackingId}
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleCopyTracking(parcel.trackingId)}
                              title="Copy Tracking ID"
                              className="text-gray-400 hover:text-[#003b40]"
                            >
                              <LuCopy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-mono">Pending</span>
                        )}
                      </td>

                      {/* Destination */}
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <LuMapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span>{parcel.receiverDistrict || parcel.receiverRegion || '—'}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 text-xs text-gray-500">
                        {parcel.createdAt
                          ? new Date(parcel.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                          : '—'}
                      </td>

                      {/* Cost */}
                      <td className="py-4 font-semibold text-[#003b40]">
                        ৳{parcel.cost || 0}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4">
                        {parcel.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center rounded-full bg-[#f2f8df] px-2.5 py-0.5 text-xs font-bold text-[#6c861f]">
                            Paid
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                            className="inline-flex items-center rounded-full bg-[#caea3e] px-2.5 py-0.5 text-xs font-bold text-[#003b40] transition hover:brightness-95"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>

                      {/* Delivery Status */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${getDeliveryStatusBadge(
                            parcel.deliveryStatus
                          )}`}
                        >
                          {parcel.deliveryStatus
                            ? parcel.deliveryStatus.replace(/-/g, ' ')
                            : 'Pending'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 pr-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {parcel.trackingId && (
                            <Link
                              to={`/parcel-track/${parcel.trackingId}`}
                              className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-[#003b40] hover:text-white"
                              title="Track Shipment"
                            >
                              <LuTruck className="h-4 w-4" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedParcel(parcel)}
                            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-[#003b40] hover:text-white"
                            title="View Details"
                          >
                            <LuEye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Empty State for user without shipments */
          <div className="mt-5 sm:mt-6 flex flex-col items-center justify-center rounded-2xl bg-[#fafbfb] py-10 sm:py-14 px-4 text-center">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-[#f2f8df] text-[#7c9825]">
              <LuPackage className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="mt-3.5 sm:mt-4 text-sm sm:text-base font-bold text-[#003b40]">
              No shipments found
            </h3>
            <p className="mt-1 max-w-sm text-[11px] sm:text-xs leading-4 sm:leading-5 text-gray-500">
              You haven&apos;t booked any parcels yet. Start shipping today with fast pick-up and live tracking across the nation!
            </p>
            <Link
              to="/send-parcel"
              className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-xl bg-[#003b40] px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-white transition hover:bg-[#004f56]"
            >
              <LuPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Book Your First Parcel</span>
            </Link>
          </div>
        )}
      </div>

      {/* ============================================================
          PARCEL DETAIL MODAL
      ============================================================ */}
      {selectedParcel && (
        <ParcelDetailModal
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
          onTrack={(trackingId) => {
            setSelectedParcel(null);
            navigate(`/parcel-track/${trackingId}`);
          }}
          onPay={(id) => {
            setSelectedParcel(null);
            navigate(`/dashboard/payment/${id}`);
          }}
        />
      )}
    </div>
  );
};

export default UserDashboardHome;
