import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: stats = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['delivery-status-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/delivery-status/stats');

      return Array.isArray(res.data) ? res.data : [];
    },
  });

  /* =========================
     STATUS CONFIG
  ========================= */

  const statusConfig = [
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

  /* =========================
     DATA PROCESSING
  ========================= */

  const statusCounts = stats.reduce((acc, item) => {
    acc[item._id] = Number(item.count || 0);
    return acc;
  }, {});

  const totalParcels = stats.reduce(
    (total, item) => total + Number(item.count || 0),
    0,
  );

  const chartData = statusConfig
    .map(status => ({
      name: status.shortLabel,
      fullName: status.label,
      value: statusCounts[status.key] || 0,
      color: status.chart,
    }))
    .filter(item => item.value > 0);

  const barData = statusConfig.map(status => ({
    name: status.shortLabel,
    parcels: statusCounts[status.key] || 0,
  }));

  const deliveredCount = statusCounts.delivered || 0;
  const rejectedCount = statusCounts['driver-rejected'] || 0;
  const inTransitCount = statusCounts['in-transit'] || 0;

  const deliveredPercentage =
    totalParcels > 0 ? Math.round((deliveredCount / totalParcels) * 100) : 0;

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#003b40]" />
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-3xl font-bold text-red-500">
          ×
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#003b40]">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-7">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c9825]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#003b40] md:text-4xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Keep an eye on your parcel operations, delivery progress, and
            overall shipment activity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7c9825]" />
          <span className="text-xs font-semibold text-gray-600">
            Live Delivery Overview
          </span>
        </div>
      </div>

      {/* =====================================
          TOP STAT CARDS
      ===================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="relative overflow-hidden rounded-[26px] bg-[#003b40] p-6 shadow-sm">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#c6ef52]/10" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#c9d9da]">
                Total Parcels
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c6ef52] text-lg">
                📦
              </div>
            </div>

            <h2 className="mt-5 text-4xl font-bold text-white">
              {totalParcels}
            </h2>

            <p className="mt-2 text-xs text-[#a9c0c2]">
              All parcels in the system
            </p>
          </div>
        </div>

        {/* Delivered */}
        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f8df] text-lg">
              ✓
            </div>

            <span className="rounded-full bg-[#f2f8df] px-3 py-1 text-xs font-bold text-[#6c861f]">
              {deliveredPercentage}%
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">Delivered</p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {deliveredCount}
          </h2>

          <p className="mt-1 text-xs text-gray-400">Successfully completed</p>
        </div>

        {/* In Transit */}
        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
              →
            </div>

            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">In Transit</p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {inTransitCount}
          </h2>

          <p className="mt-1 text-xs text-gray-400">Currently on the road</p>
        </div>

        {/* Rejected */}
        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg text-red-500">
              ×
            </div>

            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">Rejected</p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {rejectedCount}
          </h2>

          <p className="mt-1 text-xs text-gray-400">Driver rejected parcels</p>
        </div>
      </div>

      {/* =====================================
          CHART SECTION
      ===================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* BAR CHART */}
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-3 md:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#003b40]">
                Delivery Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Parcel distribution across each delivery stage.
              </p>
            </div>

            <div className="rounded-full bg-[#f4f7f7] px-3 py-1.5 text-xs font-semibold text-[#003b40]">
              {totalParcels} Total
            </div>
          </div>

          <div className="mt-8 h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 5,
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
                    fontSize: 11,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#718083',
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: '#f5f7f7',
                  }}
                  contentStyle={{
                    border: 'none',
                    borderRadius: '14px',
                    boxShadow: '0 10px 30px rgba(0, 59, 64, 0.12)',
                  }}
                  formatter={value => [`${value} parcels`, 'Count']}
                />

                <Bar
                  dataKey="parcels"
                  fill="#003b40"
                  radius={[7, 7, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2 md:p-7">
          <div>
            <h2 className="text-xl font-bold text-[#003b40]">
              Parcel Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current share by delivery status.
            </p>
          </div>

          <div className="relative mt-4 h-[280px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={72}
                    outerRadius={105}
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
                    formatter={value => [`${value} parcels`, 'Count']}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{
                      fontSize: '11px',
                      color: '#647174',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">📦</div>

                  <p className="mt-3 text-sm font-semibold text-[#003b40]">
                    No parcel data
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Delivery statistics will appear here.
                  </p>
                </div>
              </div>
            )}

            {chartData.length > 0 && (
              <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold text-[#003b40]">
                  {totalParcels}
                </p>

                <p className="text-[10px] font-medium text-gray-400">Parcels</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          STATUS DETAILS
      ===================================== */}

      <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#003b40]">
              Delivery Pipeline
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              A quick view of where your parcels are right now.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#f2f8df] px-3 py-1.5 text-xs font-bold text-[#6c861f]">
            {deliveredPercentage}% Delivered
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {statusConfig.map(status => {
            const count = statusCounts[status.key] || 0;

            const percentage =
              totalParcels > 0 ? Math.round((count / totalParcels) * 100) : 0;

            return (
              <div
                key={status.key}
                className="rounded-2xl border border-gray-100 bg-[#fafbfb] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />

                  <span className="text-xs font-bold text-gray-400">
                    {percentage}%
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold leading-5 text-gray-500">
                  {status.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-[#003b40]">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
