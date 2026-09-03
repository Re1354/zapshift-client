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
    <div className="min-h-screen bg-[#eef0f1] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1400px] rounded-[22px] bg-white px-7 py-12 md:px-14 lg:px-16">
        {/* ================= Header ================= */}
        <div className="mb-8">
          <h1 className="text-[38px] font-bold leading-tight text-[#003b40]">
            Be a Rider
          </h1>

          <p className="mt-3 max-w-[600px] text-[13px] leading-[1.7] text-[#777777]">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        {/* ================= Divider ================= */}
        <div className="border-t border-[#e5e5e5]" />

        {/* ================= Form ================= */}
        <form onSubmit={handleSubmit(handleRiderApplication)}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
            {/* ================= Left Side ================= */}
            <div className="max-w-[500px]">
              <h2 className="mb-5 text-[21px] font-bold text-[#003b40]">
                Tell us about yourself
              </h2>

              {/* ================= Name ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.name && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* ================= Driving License ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Driving License Number
                </label>

                <input
                  type="text"
                  placeholder="Driving License Number"
                  {...register('licenseNumber', {
                    required: 'Driving license number is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.licenseNumber && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.licenseNumber.message}
                  </p>
                )}
              </div>

              {/* ================= Email ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Your Email
                </label>

                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="h-[38px] w-full cursor-not-allowed rounded-[5px] border border-[#d6dde2] bg-gray-100 px-3 text-[12px] text-[#666666] outline-none"
                />
              </div>

              {/* ================= Region ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Your Region
                </label>

                <select
                  {...register('region', {
                    required: 'Please select your region',
                  })}
                  defaultValue=""
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-gray-500 outline-none focus:border-[#9acb28]"
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
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.region.message}
                  </p>
                )}
              </div>

              {/* ================= District ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Your District
                </label>

                <select
                  {...register('district', {
                    required: 'Please select your district',
                  })}
                  disabled={!region}
                  defaultValue=""
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-gray-500 outline-none focus:border-[#9acb28] disabled:cursor-not-allowed disabled:bg-gray-100"
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
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* ================= NID ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  NID No
                </label>

                <input
                  type="text"
                  placeholder="NID"
                  {...register('nid', {
                    required: 'NID is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.nid && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.nid.message}
                  </p>
                )}
              </div>

              {/* ================= Phone ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Phone Number"
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.phone && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* ================= Bike Brand Model Year ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Bike Brand Model and Year
                </label>

                <input
                  type="text"
                  placeholder="Bike Brand Model and Year"
                  {...register('bikeModel', {
                    required: 'Bike brand, model and year is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.bikeModel && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.bikeModel.message}
                  </p>
                )}
              </div>

              {/* ================= Bike Registration ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Bike Registration Number
                </label>

                <input
                  type="text"
                  placeholder="Bike Registration Number"
                  {...register('bikeRegistration', {
                    required: 'Bike registration number is required',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.bikeRegistration && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.bikeRegistration.message}
                  </p>
                )}
              </div>

              {/* ================= About Yourself ================= */}
              <div className="mb-4">
                <label className="mb-1.5 block text-[11px] font-medium text-[#222222]">
                  Tell Us About Yourself
                </label>

                <input
                  type="text"
                  placeholder="Tell Us About Yourself"
                  {...register('about', {
                    required: 'Please tell us about yourself',
                  })}
                  className="h-[38px] w-full rounded-[5px] border border-[#d6dde2] bg-white px-3 text-[12px] text-[#333333] outline-none placeholder:text-[#a9b8c7] focus:border-[#9acb28]"
                />

                {errors.about && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.about.message}
                  </p>
                )}
              </div>

              {/* ================= Submit ================= */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 h-[38px] w-full rounded-[5px] bg-[#c6ef52] text-[12px] font-medium text-black transition hover:bg-[#b9e83e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
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
    </div>
  );
};

export default Rider;
