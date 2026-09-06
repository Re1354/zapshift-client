import React, { useState } from 'react';

const PriceCalculation = () => {
  const [parcelType, setParcelType] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(50);

  const handleCalculate = e => {
    e.preventDefault();
    let calculatedPrice = 60;
    const w = parseFloat(weight) || 1;
    if (parcelType === 'document') {
      calculatedPrice = destination === 'dhaka' ? 60 : 80;
    } else {
      const base = destination === 'dhaka' ? 110 : 150;
      calculatedPrice = w <= 3 ? base : base + Math.ceil(w - 3) * 40;
    }
    setPrice(calculatedPrice);
  };

  const handleReset = () => {
    setParcelType('');
    setDestination('');
    setWeight('');
    setPrice(50);
  };

  const inputClass =
    'h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition duration-200 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div className="w-full rounded-3xl bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl md:text-5xl">
          Pricing Calculator
        </h1>

        <p className="mt-3 max-w-[560px] text-xs leading-6 text-gray-500 sm:text-sm">
          Enjoy fast, reliable parcel delivery with real-time tracking and
          zero hassle. From personal packages to business shipments — we
          deliver on time, every time.
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 sm:my-8 border-t border-gray-100" />

      {/* Calculator Heading */}
      <h2 className="text-center text-xl font-bold text-secondary md:text-2xl">
        Calculate Your Cost
      </h2>

      {/* Calculator */}
      <div className="mx-auto mt-8 flex max-w-[760px] flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
        {/* Form */}
        <form onSubmit={handleCalculate} className="w-full max-w-[340px]">
          {/* Parcel Type */}
          <div className="mb-4">
            <label
              htmlFor="parcelType"
              className="mb-1.5 block text-xs font-semibold text-secondary"
            >
              Parcel type
            </label>

            <select
              id="parcelType"
              value={parcelType}
              onChange={e => setParcelType(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Parcel type</option>
              <option value="document">Document</option>
              <option value="small">Small Parcel</option>
              <option value="medium">Medium Parcel</option>
              <option value="large">Large Parcel</option>
            </select>
          </div>

          {/* Delivery Destination */}
          <div className="mb-4">
            <label
              htmlFor="destination"
              className="mb-1.5 block text-xs font-semibold text-secondary"
            >
              Delivery Destination
            </label>

            <select
              id="destination"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Delivery Destination</option>
              <option value="dhaka">Dhaka</option>
              <option value="chittagong">Chittagong</option>
              <option value="sylhet">Sylhet</option>
              <option value="khulna">Khulna</option>
              <option value="rajshahi">Rajshahi</option>
            </select>
          </div>

          {/* Weight */}
          <div className="mb-5">
            <label
              htmlFor="weight"
              className="mb-1.5 block text-xs font-semibold text-secondary"
            >
              Weight (KG)
            </label>

            <input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Enter weight in KG"
              className={inputClass}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="h-11 rounded-full border border-gray-300 bg-white px-5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 active:scale-95"
            >
              Reset
            </button>

            <button
              type="submit"
              className="group h-11 flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 text-xs font-bold text-secondary transition hover:bg-primary-hover active:scale-95 shadow-sm"
            >
              <span>Calculate</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </button>
          </div>
        </form>

        {/* Price */}
        <div className="flex w-full max-w-[300px] flex-col items-center justify-center rounded-3xl bg-[#f4f7f8] p-8 text-center sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Estimated Cost
          </span>
          <h3 className="mt-2 text-5xl font-black tracking-tight text-secondary md:text-6xl">
            ৳{price}
          </h3>
          <p className="mt-2 text-[11px] text-gray-400">
            *Final price subject to pickup verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculation;
