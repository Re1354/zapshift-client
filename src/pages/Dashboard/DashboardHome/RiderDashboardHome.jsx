import React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { LuPackage } from 'react-icons/lu';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const RiderDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: deliveryData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['rider-delivery-per-day', user?.email],

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/delivery-per-day?email=${encodeURIComponent(user.email)}`,
      );

      return Array.isArray(res.data) ? res.data : [];
    },

    enabled: !!user?.email,
  });

  // =====================================
  // CHART DATA
  // =====================================

  const chartData = deliveryData.map(item => ({
    date: item.date,
    delivered: Number(item.delivered || 0),

    displayDate: new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  // =====================================
  // STATISTICS
  // =====================================

  const totalDelivered = chartData.reduce(
    (total, item) => total + item.delivered,
    0,
  );

  const activeDays = chartData.length;

  const averagePerDay =
    activeDays > 0 ? (totalDelivered / activeDays).toFixed(1) : '0.0';

  const bestDay =
    chartData.length > 0
      ? chartData.reduce((best, current) =>
          current.delivered > best.delivered ? current : best,
        )
      : null;

  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#003b40]" />
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (isError) {
    return (
      <div className="rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-3xl font-bold text-red-500">
          ×
        </div>

        <h2 className="mt-5 text-xl font-bold text-[#003b40]">
          Unable to load delivery data
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
            Rider Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#003b40] md:text-4xl">
            Delivery Overview
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Track your completed deliveries and daily delivery performance.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7c9825]" />

          <span className="text-xs font-semibold text-gray-600">
            Delivery Performance
          </span>
        </div>
      </div>

      {/* =====================================
          STAT CARDS
      ===================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Delivered */}

        <div className="relative overflow-hidden rounded-[26px] bg-[#003b40] p-6 shadow-sm">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#c6ef52]/10" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#c9d9da]">
                Total Delivered
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c6ef52] text-[#003b40]">
                <LuPackage className="h-5 w-5" />
              </div>
            </div>

            <h2 className="mt-5 text-4xl font-bold text-white">
              {totalDelivered}
            </h2>

            <p className="mt-2 text-xs text-[#a9c0c2]">
              Successfully completed parcels
            </p>
          </div>
        </div>

        {/* Active Days */}

        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
              ◷
            </div>

            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            Active Delivery Days
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {activeDays}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Days with completed deliveries
          </p>
        </div>

        {/* Average */}

        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg text-violet-600">
              ↗
            </div>

            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
              Daily
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            Average Per Day
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {averagePerDay}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Completed parcels per active day
          </p>
        </div>

        {/* Best Day */}

        <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f8df] text-lg text-[#6c861f]">
              ★
            </div>

            <span className="rounded-full bg-[#f2f8df] px-3 py-1 text-xs font-bold text-[#6c861f]">
              Best
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">
            Best Delivery Day
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#003b40]">
            {bestDay?.delivered || 0}
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            {bestDay ? bestDay.displayDate : 'No deliveries yet'}
          </p>
        </div>
      </div>

      {/* =====================================
          CHARTS
      ===================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* BAR CHART */}

        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-3 md:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#003b40]">
                Daily Deliveries
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Number of parcels delivered each day.
              </p>
            </div>

            <div className="rounded-full bg-[#f4f7f7] px-3 py-1.5 text-xs font-semibold text-[#003b40]">
              {totalDelivered} Delivered
            </div>
          </div>

          <div className="mt-8 h-[330px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
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
                    dataKey="displayDate"
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
                    formatter={value => [`${value} parcels`, 'Delivered']}
                  />

                  <Bar
                    dataKey="delivered"
                    fill="#003b40"
                    radius={[7, 7, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* LINE CHART */}

        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2 md:p-7">
          <div>
            <h2 className="text-xl font-bold text-[#003b40]">Delivery Trend</h2>

            <p className="mt-1 text-sm text-gray-500">
              Your delivery activity over time.
            </p>
          </div>

          <div className="mt-8 h-[330px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
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
                    dataKey="displayDate"
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
                    contentStyle={{
                      border: 'none',
                      borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0, 59, 64, 0.12)',
                    }}
                    formatter={value => [`${value} parcels`, 'Delivered']}
                  />

                  <Line
                    type="monotone"
                    dataKey="delivered"
                    stroke="#7c9825"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#7c9825',
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* =====================================
          DAILY BREAKDOWN
      ===================================== */}

      <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#003b40]">
              Daily Delivery Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your completed parcel count by day.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#f2f8df] px-3 py-1.5 text-xs font-bold text-[#6c861f]">
            {activeDays} Active Days
          </span>
        </div>

        {chartData.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-3 rounded-xl bg-[#f6f8f8] px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                <span>Date</span>

                <span className="text-center">Delivered</span>

                <span className="text-right">Performance</span>
              </div>

              <div className="divide-y divide-gray-100">
                {[...chartData]
                  .reverse()
                  .slice(0, 7)
                  .map(item => {
                    const percentage =
                      totalDelivered > 0
                        ? Math.round((item.delivered / totalDelivered) * 100)
                        : 0;

                    return (
                      <div
                        key={item.date}
                        className="grid grid-cols-3 items-center px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#003b40]">
                            {item.displayDate}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {item.date}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="inline-flex rounded-full bg-[#f2f8df] px-3 py-1 text-xs font-bold text-[#6c861f]">
                            {item.delivered} parcels
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-gray-100 sm:block">
                            <div
                              className="h-full rounded-full bg-[#7c9825]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <span className="w-10 text-right text-xs font-semibold text-gray-500">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
};

/* =====================================
   EMPTY STATE
===================================== */

const EmptyState = () => {
  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-2xl bg-[#fafbfb] text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2f8df] text-[#7c9825]">
        <LuPackage className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-[#003b40]">
        No delivery data yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
        Your completed deliveries will appear here once you start delivering
        parcels.
      </p>
    </div>
  );
};

export default RiderDashboardHome;
