import React, { useRef, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { useLoaderData } from 'react-router';

const Coverage = () => {
  const serviceCenters = useLoaderData();

  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchMessage, setSearchMessage] = useState('');

  // Bangladesh center
  const mapCenter = [23.685, 90.3563];

  // Bangladesh approximate bounds
  const bangladeshBounds = [
    [20.55, 88.0],
    [26.65, 92.7],
  ];

  const handleSearch = e => {
    e.preventDefault();

    const location = searchText.trim().toLowerCase();

    if (!location) {
      setSearchMessage('');
      return;
    }

    const district = serviceCenters?.find(
      center =>
        center.district?.toLowerCase().includes(location) ||
        center.city?.toLowerCase().includes(location) ||
        center.region?.toLowerCase().includes(location),
    );

    if (district) {
      const coordinates = [
        Number(district.latitude),
        Number(district.longitude),
      ];

      mapRef.current?.flyTo(coordinates, 11, {
        duration: 1.5,
      });

      setSearchMessage('');
    } else {
      setSearchMessage('District not found');
    }
  };

  return (
    <section className="bg-[#eef0f1] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Main Coverage Card */}
        <div className="rounded-[28px] bg-white/40 px-6 py-8 md:px-10 md:py-10">
          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold leading-tight text-secondary md:text-4xl">
              We are available in 64 districts
            </h2>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="flex h-11 w-full max-w-[320px] items-center rounded-full border border-secondary/20 bg-white px-4 shadow-sm">
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4 shrink-0 text-secondary/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="search"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search district"
                className="w-full bg-transparent text-xs text-secondary outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              className="
                h-11
                rounded-full
                bg-primary
                px-7
                text-sm
                font-bold
                text-secondary
                transition
                duration-300
                hover:scale-105
              "
            >
              Search
            </button>
          </form>

          {/* Search Error */}
          {searchMessage && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {searchMessage}
            </p>
          )}

          {/* Map Title */}
          <h3 className="mt-8 text-lg font-bold text-secondary md:text-xl">
            We deliver almost all over Bangladesh
          </h3>

          {/* Map */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-sm">
            <MapContainer
              center={mapCenter}
              zoom={7}
              minZoom={7}
              maxZoom={13}
              scrollWheelZoom={false}
              zoomControl={true}
              ref={mapRef}
              maxBounds={bangladeshBounds}
              maxBoundsViscosity={1}
              className="h-[350px] w-full md:h-[430px] lg:h-[470px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                noWrap={true}
              />

              {/* Service Center Markers */}
              {serviceCenters?.map(center => (
                <Marker
                  key={`${center.region}-${center.district}`}
                  position={[Number(center.latitude), Number(center.longitude)]}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      {/* District */}
                      <h3 className="text-base font-bold text-secondary">
                        {center.district}
                      </h3>

                      {/* Location */}
                      <p className="mt-1 text-xs text-gray-500">
                        {center.city}, {center.region}
                      </p>

                      {/* Divider */}
                      <div className="my-3 border-t border-gray-200" />

                      {/* Covered Area */}
                      <p className="text-xs font-bold text-secondary">
                        Covered Areas
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {center.covered_area?.join(', ')}
                      </p>

                      {/* Status */}
                      <div className="mt-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${
                            center.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {center.status}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coverage;
