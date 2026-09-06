import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

import riderImg from '../../assets/agent-pending.png';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const Rider = () => {
  const serviceCenters = useLoaderData();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      region: '',
      district: '',
    },
  });

  const axiosSecure = useAxiosSecure();

  // Get all unique regions from service centers
  const regions = [...new Set(serviceCenters.map(center => center.region))];

  // Watch selected region
  const region = useWatch({
    control,
    name: 'region',
  });

  // Get districts based on selected region
  const districtsByRegion = selectedRegion => {
    return [
      ...new Set(
        serviceCenters
          .filter(center => center.region === selectedRegion)
          .map(center => center.district),
      ),
    ];
  };

  const districts = districtsByRegion(region);

  // ================= Rider Application Submit =================
  const handleRiderApplication = async data => {
    try {
      // Always use logged-in user's email
      const riderData = {
        ...data,
        email: user?.email,
      };

      const res = await axiosSecure.post('/riders', riderData);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text:
            res.data.message ||
            'Your rider application has been submitted successfully.',
          toast: true,
          position: 'top-right',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });

        reset();
      }
    } catch (error) {
      console.error('Rider application error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text:
          error?.response?.data?.message ||
          'We could not submit your rider application. Please try again.',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl md:text-5xl">
          Be a Rider
        </h1>

        <p className="mt-3 max-w-[560px] text-xs leading-6 text-gray-500 sm:text-sm">
          Enjoy fast, reliable parcel delivery with real-time tracking and
          zero hassle. From personal packages to business shipments — we
          deliver on time, every time.
        </p>
      </div>

      {/* ================= Divider ================= */}
      <div className="my-6 sm:my-8 border-t border-gray-100" />

      {/* ================= Form ================= */}
      <form onSubmit={handleSubmit(handleRiderApplication)}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
          {/* ================= Left Side ================= */}
          <div className="max-w-[500px]">
            <h2 className="mb-5 text-[21px] font-bold text-secondary">
              Tell us about yourself
            </h2>

              {/* ================= Name ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* ================= Driving License ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Driving License Number
                </label>

                <input
                  type="text"
                  placeholder="Driving License Number"
                  {...register('licenseNumber', {
                    required: 'Driving license number is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.licenseNumber && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              {/* ================= Email ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Your Email
                </label>

                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="h-10 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3.5 text-xs text-gray-500 outline-none"
                />
              </div>

              {/* ================= Region ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Your Region
                </label>

                <select
                  {...register('region', {
                    required: 'Please select your region',
                  })}
                  defaultValue=""
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled>
                    Select your Region
                  </option>

                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {errors.region && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.region.message}
                  </p>
                )}
              </div>

              {/* ================= District ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Your District
                </label>

                <select
                  {...register('district', {
                    required: 'Please select your district',
                  })}
                  disabled={!region}
                  defaultValue=""
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="" disabled>
                    {region ? 'Select your District' : 'Select Region First'}
                  </option>

                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                {errors.district && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* ================= NID ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  NID No
                </label>

                <input
                  type="text"
                  placeholder="NID"
                  {...register('nid', {
                    required: 'NID is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.nid && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.nid.message}
                  </p>
                )}
              </div>

              {/* ================= Phone ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Phone Number"
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* ================= Bike Brand Model Year ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Bike Brand Model and Year
                </label>

                <input
                  type="text"
                  placeholder="Bike Brand Model and Year"
                  {...register('bikeModel', {
                    required: 'Bike brand, model and year is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.bikeModel && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.bikeModel.message}
                  </p>
                )}
              </div>

              {/* ================= Bike Registration ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Bike Registration Number
                </label>

                <input
                  type="text"
                  placeholder="Bike Registration Number"
                  {...register('bikeRegistration', {
                    required: 'Bike registration number is required',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.bikeRegistration && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.bikeRegistration.message}
                  </p>
                )}
              </div>

              {/* ================= About Yourself ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-secondary">
                  Tell Us About Yourself
                </label>

                <input
                  type="text"
                  placeholder="Tell Us About Yourself"
                  {...register('about', {
                    required: 'Please tell us about yourself',
                  })}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-secondary outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {errors.about && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {errors.about.message}
                  </p>
                )}
              </div>

              {/* ================= Submit ================= */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-secondary shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e232a] text-xs font-bold text-primary">
                  ↗
                </span>
              </button>
            </div>

            {/* ================= Right Side ================= */}
            <div className="flex items-start justify-center lg:pt-8">
              <img
                src={riderImg}
                alt="Rider delivering a parcel"
                className="mt-4 w-[300px] object-contain md:w-[360px] lg:mt-8 lg:w-[400px]"
              />
            </div>
          </div>
        </form>
    </div>
  );
};

export default Rider;
