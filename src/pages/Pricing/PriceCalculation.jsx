import React, { useState } from 'react';

const PriceCalculation = () => {
  const [parcelType, setParcelType] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(50);

  const handleCalculate = e => {
    e.preventDefault();

    // You can add your actual pricing logic here later.
    setPrice(50);
  };

  const handleReset = () => {
    setParcelType('');
    setDestination('');
    setWeight('');
    setPrice(50);
  };

  return (
    <section className="bg-[#eef0f1] py-5 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Main Card */}
        <div className="rounded-[24px] bg-white px-8 py-12 md:px-12 md:py-14 lg:px-20 lg:py-16">
          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#004b50] md:text-5xl">
              Pricing Calculator
            </h1>

            <p className="mt-4 max-w-[520px] text-xs leading-5 text-gray-500 md:text-sm">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          {/* Divider */}
          <div className="my-9 border-t border-gray-200" />

          {/* Calculator Heading */}
          <h2 className="text-center text-xl font-bold text-[#004b50] md:text-2xl">
            Calculate Your Cost
          </h2>

          {/* Calculator */}
          <div className="mx-auto mt-9 flex max-w-[700px] flex-col items-center justify-between gap-12 md:flex-row md:gap-16">
            {/* Form */}
            <form onSubmit={handleCalculate} className="w-full max-w-[280px]">
              {/* Parcel Type */}
              <div className="mb-4">
                <label
                  htmlFor="parcelType"
                  className="mb-1 block text-xs font-medium text-secondary"
                >
                  Parcel type
                </label>

                <select
                  id="parcelType"
                  value={parcelType}
                  onChange={e => setParcelType(e.target.value)}
                  className="h-8 w-full rounded-md border border-[#d6dde2] bg-white px-2 text-xs text-gray-400 outline-none focus:border-secondary"
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
                  className="mb-1 block text-xs font-medium text-secondary"
                >
                  Delivery Destination
                </label>

                <select
                  id="destination"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="h-8 w-full rounded-md border border-[#d6dde2] bg-white px-2 text-xs text-gray-400 outline-none focus:border-secondary"
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
              <div className="mb-4">
                <label
                  htmlFor="weight"
                  className="mb-1 block text-xs font-medium text-secondary"
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
                  placeholder="Contact"
                  className="h-8 w-full rounded-md border border-[#d6dde2] bg-white px-2 text-xs outline-none placeholder:text-gray-400 focus:border-secondary"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-8 w-[70px] rounded-md border border-[#9ab54a] bg-white text-[10px] font-medium text-[#657b2b] transition hover:bg-[#f8fceb]"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="h-8 flex-1 rounded-md bg-primary text-[10px] font-semibold text-secondary transition hover:brightness-95"
                >
                  Calculate
                </button>
              </div>
            </form>

            {/* Price */}
            <div className="flex min-h-[150px] w-full max-w-[300px] items-center justify-center">
              <h3 className="text-6xl font-black tracking-tight text-black md:text-7xl">
                {price} Tk
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculation;
