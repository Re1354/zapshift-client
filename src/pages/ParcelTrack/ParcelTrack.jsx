import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { LuCheck, LuSearch, LuPackage, LuMapPin } from 'react-icons/lu';
import useAxios from '../../hooks/useAxios';

const ParcelTrack = () => {
  const { trackingId: paramTrackingId } = useParams();
  const axiosInstance = useAxios();

  const [searchInput, setSearchInput] = useState(paramTrackingId || '');
  const [activeTrackingId, setActiveTrackingId] = useState(
    paramTrackingId || '',
  );

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['tracking', activeTrackingId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/trackings/${encodeURIComponent(activeTrackingId)}`,
      );
      return res.data;
    },
    enabled: Boolean(activeTrackingId),
    retry: false,
  });

  const logs = data?.logs || [];
  const parcel = data?.parcel || null;
  const currentStatus = logs[logs.length - 1]?.status || null;

  const handleSearch = event => {
    event.preventDefault();

    const value = searchInput.trim().toUpperCase();

    if (!value) return;

    setActiveTrackingId(value);
  };

  const statusInfo = {
    'pending-pickup': {
      title: 'Pending Pickup',
      description: 'Payment confirmed — waiting for parcel pickup.',
    },
    'driver-assigned': {
      title: 'Assigned to Rider',
      description: 'A rider has been assigned to your parcel.',
    },
    'driver-accepted': {
      title: 'Rider Accepted',
      description: 'The rider has accepted the delivery.',
    },
    'picked-up': {
      title: 'Parcel Picked Up',
      description: 'The parcel has been picked up from the sender.',
    },
    'in-transit': {
      title: 'In Transit',
      description: 'Your parcel is currently on the way.',
    },
    delivered: {
      title: 'Delivered',
      description: 'Your parcel has been delivered successfully.',
    },
    'driver-rejected': {
      title: 'Delivery Rejected',
      description: 'The assigned rider rejected this delivery.',
    },
  };

  const getStatus = status =>
    statusInfo[status] || {
      title: status?.replace(/-/g, ' ') || 'Unknown',
      description: 'Tracking information has been updated.',
    };

  const formatDate = value => {
    if (!value) return 'N/A';

    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = value => {
    if (!value) return '';

    return new Date(value).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = value => {
    if (!value) return 'N/A';

    return new Date(value).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getParcelId = () => {
    if (parcel?.parcelId) return parcel.parcelId;
    if (parcel?._id) return parcel._id;
    if (logs[0]?.parcelId) return logs[0].parcelId;
    return 'N/A';
  };

  return (
    <div className="w-full rounded-3xl bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl md:text-5xl">
          Track Your Consignment
        </h1>

        <p className="mt-3 text-xs text-gray-500 sm:text-sm">
          Now you can easily track your consignment
        </p>
      </div>

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="mt-7 flex w-full max-w-[360px] items-center overflow-hidden rounded-full bg-[#f0f3f5]"
      >
        <LuSearch className="ml-4 h-4 w-4 shrink-0 text-[#202b2d]" />

        <input
          type="text"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
          placeholder="Search tracking code here"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[11px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={!searchInput.trim() || isFetching}
          className="h-11 rounded-full bg-primary px-6 text-xs font-bold text-secondary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFetching ? '...' : 'Search'}
        </button>
      </form>

      <div className="my-7 sm:my-8 border-t border-gray-100" />

        {/* NO TRACKING ID */}
        {!activeTrackingId && (
          <div className="rounded-[28px] bg-[#eef2f4] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dff4ad] text-[#75951f]">
              <LuSearch className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#003b40]">
              Track your parcel
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your tracking ID above to see the delivery updates.
            </p>
          </div>
        )}

        {/* LOADING */}
        {activeTrackingId && isLoading && (
          <div className="rounded-[28px] bg-[#eef2f4] px-6 py-20 text-center">
            <span className="loading loading-spinner loading-lg text-[#003b40]" />
            <p className="mt-4 text-sm text-gray-500">
              Loading tracking information...
            </p>
          </div>
        )}

        {/* ERROR */}
        {activeTrackingId && !isLoading && isError && (
          <div className="rounded-[28px] bg-[#eef2f4] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
              <LuPackage className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#003b40]">
              No tracking information found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We could not find any updates for{' '}
              <span className="font-mono font-semibold text-gray-700">
                {activeTrackingId}
              </span>
              .
            </p>
          </div>
        )}

        {/* TRACKING RESULT */}
        {activeTrackingId && !isLoading && !isError && logs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
            {/* PRODUCT DETAILS */}
            <div className="min-h-[570px] rounded-[28px] bg-[#eef2f4] px-7 py-8 sm:px-8">
              <h2 className="text-2xl font-bold text-[#003b40]">
                Product details
              </h2>

              <p className="mt-3 text-[11px] text-gray-600">
                {formatFullDate(logs[0]?.createdAt)}{' '}
                {formatTime(logs[0]?.createdAt)}
              </p>

              <div className="mt-1 space-y-1 text-[12px] leading-5 text-gray-500">
                <p>
                  <span className="font-medium text-[#003b40]">Id : </span>
                  {getParcelId()}
                </p>

                <p>
                  <span className="font-medium text-[#003b40]">
                    Tracking Code :{' '}
                  </span>
                  <span className="font-mono text-[10px]">
                    {activeTrackingId}
                  </span>
                </p>
              </div>

              <div className="my-6 h-px bg-gray-300" />

              <div className="space-y-1 text-[12px] leading-5 text-gray-500">
                <p>
                  <span className="font-medium text-[#003b40]">Name : </span>
                  {parcel?.senderName || 'N/A'}
                </p>

                <p>
                  <span className="font-medium text-[#003b40]">Address : </span>
                  {parcel
                    ? [
                        parcel.senderAddress,
                        parcel.senderDistrict,
                        parcel.senderRegion,
                        parcel.senderPostalCode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'N/A'
                    : 'N/A'}
                </p>

                <p>
                  <span className="font-medium text-[#003b40]">
                    Phone Number :{' '}
                  </span>
                  {parcel?.senderPhone || 'N/A'}
                </p>
              </div>

              <div className="my-6 h-px bg-gray-300" />

              <div className="space-y-1 text-[12px] leading-5 text-gray-500">
                <p>
                  <span className="font-medium text-[#003b40]">
                    Approved :{' '}
                  </span>
                  {parcel?.paymentStatus === 'paid' ? 'Yes' : 'N/A'}
                </p>

                <p>
                  <span className="font-medium text-[#003b40]">Weight : </span>
                  {parcel?.parcelWeight ? `${parcel.parcelWeight} KG` : 'N/A'}
                </p>

                <p>
                  <span className="font-medium text-[#003b40]">COD : </span>
                  {parcel?.cost ? `৳ ${parcel.cost}` : '৳ 0'}
                </p>

                <p
                  className={`pt-1 font-semibold ${
                    currentStatus === 'delivered'
                      ? 'text-green-600'
                      : currentStatus === 'driver-rejected'
                        ? 'text-red-500'
                        : 'text-[#d58b00]'
                  }`}
                >
                  {getStatus(currentStatus).title}
                </p>
              </div>

              {parcel?.receiverName && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Receiver
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#003b40]">
                    {parcel.receiverName}
                  </p>

                  {parcel.receiverAddress && (
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {[
                        parcel.receiverAddress,
                        parcel.receiverDistrict,
                        parcel.receiverRegion,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* TRACKING UPDATES */}
            <div className="min-h-[570px] rounded-[28px] bg-[#eef2f4] px-7 py-8 sm:px-8">
              <h2 className="text-2xl font-bold text-[#003b40]">
                Tracking Updates
              </h2>

              <div className="mt-8">
                {logs.map((log, index) => {
                  const isLast = index === logs.length - 1;
                  const info = getStatus(log.status);

                  return (
                    <div
                      key={log._id || `${log.status}-${log.createdAt}-${index}`}
                      className="grid grid-cols-[78px_28px_1fr] gap-3"
                    >
                      {/* DATE */}
                      <div className="pt-0.5 text-right">
                        <p className="text-[11px] font-medium leading-4 text-[#263437]">
                          {formatDate(log.createdAt)}
                        </p>

                        <p className="text-[10px] leading-4 text-gray-500">
                          {formatTime(log.createdAt)}
                        </p>
                      </div>

                      {/* ICON + LINE */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            log.status === 'driver-rejected'
                              ? 'bg-red-100 text-red-500'
                              : 'bg-[#dff5e3] text-[#19b936]'
                          }`}
                        >
                          {log.status === 'driver-rejected' ? (
                            <span className="text-base font-bold">×</span>
                          ) : (
                            <LuCheck className="h-4 w-4 stroke-[3]" />
                          )}
                        </div>

                        {!isLast && (
                          <div className="w-px flex-1 bg-[#d9dfe0]" />
                        )}
                      </div>

                      {/* STATUS */}
                      <div className={`${isLast ? 'pb-0' : 'pb-7'} pt-0.5`}>
                        <p className="text-[12px] font-medium leading-5 text-[#202a2c]">
                          {info.title}
                        </p>

                        <p className="text-[10px] leading-4 text-gray-500">
                          {log.details || info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CURRENT STATUS */}
              <div className="mt-8 border-t border-gray-300 pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff5e3] text-[#19b936]">
                    <LuMapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">
                      Current Status
                    </p>
                    <p className="text-sm font-bold text-[#003b40]">
                      {getStatus(currentStatus).title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ParcelTrack;
