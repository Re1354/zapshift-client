import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: 'document',
      senderRegion: '',
      receiverRegion: '',
      senderDistrict: '',
      receiverDistrict: '',
      senderEmail: '',
      receiverEmail: '',
    },
  });

  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const serviceCenters = useLoaderData();

  // ================= Regions =================

  const regions = [...new Set(serviceCenters.map(center => center.region))];

  // ================= Selected Regions =================

  const senderRegion = useWatch({
    control,
    name: 'senderRegion',
  });

  const receiverRegion = useWatch({
    control,
    name: 'receiverRegion',
  });

  // ================= Districts By Region =================

  const districtsByRegion = region => {
    return [
      ...new Set(
        serviceCenters
          .filter(center => center.region === region)
          .map(center => center.district),
      ),
    ];
  };

  const senderDistricts = districtsByRegion(senderRegion);

  const receiverDistricts = districtsByRegion(receiverRegion);

  // ================= Submit =================

  const handleSendParcel = async data => {
    console.log('Form Data:', data);

    const isDocument = data.parcelType === 'document';

    const isSameDistrict = data.senderDistrict === data.receiverDistrict;

    const parcelWeight = data.parcelWeight;

    let cost = 0;

    // ================= Calculate Cost =================

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (parcelWeight < 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;

        const extraWeight = parcelWeight - 3;

        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;

        cost = minCharge + extraCharge;
      }
    }

    console.log('Delivery Cost:', cost);

    // ==================================================
    // Sender Email
    // If user enters email → use it
    // If empty → use logged-in user's email
    // ==================================================

    const senderEmail = data.senderEmail?.trim() || user?.email;

    // ================= Confirmation =================

    const result = await Swal.fire({
      title: 'Confirm Parcel Booking',
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8;">

          <p>
            <strong>Parcel:</strong> ${data.parcelName}
          </p>

          <p>
            <strong>Type:</strong>
            ${isDocument ? 'Document' : 'Non-Document'}
          </p>

          <p>
            <strong>Weight:</strong> ${parcelWeight} KG
          </p>

          <p>
            <strong>Sender Email:</strong>
            ${senderEmail || 'Not available'}
          </p>

          <p>
            <strong>Receiver Email:</strong>
            ${data.receiverEmail || 'Not provided'}
          </p>

          <hr style="margin: 12px 0; border-color: #eee;" />

          <p style="font-size: 20px; margin: 0;">
            <strong>Delivery Cost: ৳${cost}</strong>
          </p>

        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm Booking',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b9df45',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      focusCancel: true,
    });

    // ================= Save Parcel =================

    if (result.isConfirmed) {
      try {
        const parcelData = {
          ...data,

          // Use typed email if provided.
          // Otherwise use logged-in user's email.
          senderEmail: senderEmail,

          // Receiver email can remain empty.
          receiverEmail: data.receiverEmail?.trim() || '',

          cost,

          createdAt: new Date(),

          // Keep track of logged-in user
          userEmail: user?.email,
        };

        console.log('Final Parcel Data:', parcelData);

        const response = await axiosSecure.post('/parcels', parcelData);

        console.log('After saving parcel:', response.data);

        await Swal.fire({
          title: 'Booking Confirmed!',
          text: `Your parcel booking has been confirmed. Delivery cost: ৳${cost}`,
          icon: 'success',
          confirmButtonText: 'Done',
          confirmButtonColor: '#b9df45',
        });
      } catch (error) {
        console.error('Failed to save parcel:', error);

        Swal.fire({
          title: 'Something went wrong!',
          text: 'We could not save your parcel booking. Please try again.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    }
  };

  // ================= Common Input Style =================

  const inputClass =
    'h-10 w-full rounded-md border border-[#d6dde2] bg-white px-2 text-[11px] text-black outline-none transition duration-200 placeholder:text-[#9aaabd] focus:border-[#b9df45] focus:ring-2 focus:ring-[#b9df45]/20';

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#eef0f1] px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl rounded-[24px] bg-white px-8 py-12 md:px-12 lg:px-16">
        {/* ================= Heading ================= */}

        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#004b50] md:text-5xl">
            Send A Parcel
          </h2>
        </div>

        {/* ================= Form ================= */}

        <form onSubmit={handleSubmit(handleSendParcel)} className="mt-8">
          {/* ================= Parcel Details ================= */}

          <div>
            <h3 className="text-lg font-bold text-[#004b50]">
              Enter your parcel details
            </h3>

            <div className="mt-4 border-t border-gray-200" />

            {/* Parcel Type */}

            <div className="mt-4 flex items-center gap-8">
              <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-black">
                <input
                  type="radio"
                  value="document"
                  {...register('parcelType', {
                    required: true,
                  })}
                  className="radio radio-success h-4 w-4"
                />
                Document
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-black">
                <input
                  type="radio"
                  value="non-document"
                  {...register('parcelType', {
                    required: true,
                  })}
                  className="radio radio-success h-4 w-4"
                />
                Non-Document
              </label>
            </div>

            {errors.parcelType && (
              <p className="mt-1 text-xs text-red-500">
                Please select parcel type.
              </p>
            )}

            {/* Parcel Name + Weight */}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Parcel Name */}

              <div>
                <label
                  htmlFor="parcelName"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Parcel Name
                </label>

                <input
                  id="parcelName"
                  type="text"
                  placeholder="Parcel Name"
                  {...register('parcelName', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.parcelName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Parcel name is required.
                  </p>
                )}
              </div>

              {/* Parcel Weight */}

              <div>
                <label
                  htmlFor="parcelWeight"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Parcel Weight (KG)
                </label>

                <input
                  id="parcelWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Parcel Weight (KG)"
                  {...register('parcelWeight', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />

                {errors.parcelWeight && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Parcel weight is required.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= Sender & Receiver ================= */}

          <div className="mt-8 grid grid-cols-1 gap-7 border-t border-gray-200 pt-5 md:grid-cols-2">
            {/* ================= Sender ================= */}

            <div>
              <h3 className="mb-5 text-xs font-bold text-[#004b50]">
                Sender Details
              </h3>

              {/* Sender Name */}

              <div className="mb-3">
                <label
                  htmlFor="senderName"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Sender Name
                </label>

                <input
                  id="senderName"
                  type="text"
                  placeholder="Sender Name"
                  {...register('senderName', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.senderName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Sender name is required.
                  </p>
                )}
              </div>

              {/* Sender Email - Optional */}

              <div className="mb-3">
                <label
                  htmlFor="senderEmail"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Sender Email
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="senderEmail"
                  type="email"
                  placeholder={user?.email || 'Sender Email'}
                  {...register('senderEmail')}
                  className={inputClass}
                />

                <p className="mt-1 text-[9px] text-gray-400">
                  Leave empty to use your account email.
                </p>
              </div>

              {/* Sender Address */}

              <div className="mb-3">
                <label
                  htmlFor="senderAddress"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Address
                </label>

                <input
                  id="senderAddress"
                  type="text"
                  placeholder="Address"
                  {...register('senderAddress', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.senderAddress && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Address is required.
                  </p>
                )}
              </div>

              {/* Sender Phone */}

              <div className="mb-3">
                <label
                  htmlFor="senderPhone"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Sender Phone No
                </label>

                <input
                  id="senderPhone"
                  type="tel"
                  placeholder="Sender Phone No"
                  {...register('senderPhone', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.senderPhone && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Sender phone number is required.
                  </p>
                )}
              </div>

              {/* Sender Region */}

              <div className="mb-3">
                <label
                  htmlFor="senderRegion"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Your Region
                </label>

                <select
                  id="senderRegion"
                  {...register('senderRegion', {
                    required: true,
                  })}
                  className={`${inputClass} text-gray-500`}
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

                {errors.senderRegion && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Please select your region.
                  </p>
                )}
              </div>

              {/* Sender District */}

              <div className="mb-3">
                <label
                  htmlFor="senderDistrict"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Your District
                </label>

                <select
                  id="senderDistrict"
                  {...register('senderDistrict', {
                    required: true,
                  })}
                  disabled={!senderRegion}
                  className={`${inputClass} text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                >
                  <option value="" disabled>
                    {senderRegion
                      ? 'Select your District'
                      : 'Select Region First'}
                  </option>

                  {senderDistricts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                {errors.senderDistrict && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Please select your district.
                  </p>
                )}
              </div>

              {/* Pickup Instruction */}

              <div>
                <label
                  htmlFor="pickupInstruction"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Pickup Instruction
                </label>

                <textarea
                  id="pickupInstruction"
                  placeholder="Pickup Instruction"
                  {...register('pickupInstruction')}
                  className="h-16 w-full resize-none rounded-md border border-[#d6dde2] bg-white px-2 py-2 text-[11px] text-black outline-none transition duration-200 placeholder:text-[#9aaabd] focus:border-[#b9df45] focus:ring-2 focus:ring-[#b9df45]/20"
                />
              </div>
            </div>

            {/* ================= Receiver ================= */}

            <div>
              <h3 className="mb-5 text-xs font-bold text-[#004b50]">
                Receiver Details
              </h3>

              {/* Receiver Name */}

              <div className="mb-3">
                <label
                  htmlFor="receiverName"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver Name
                </label>

                <input
                  id="receiverName"
                  type="text"
                  placeholder="Receiver Name"
                  {...register('receiverName', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.receiverName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Receiver name is required.
                  </p>
                )}
              </div>

              {/* Receiver Email - Optional */}

              <div className="mb-3">
                <label
                  htmlFor="receiverEmail"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver Email
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="receiverEmail"
                  type="email"
                  placeholder="Receiver Email"
                  {...register('receiverEmail')}
                  className={inputClass}
                />
              </div>

              {/* Receiver Address */}

              <div className="mb-3">
                <label
                  htmlFor="receiverAddress"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver Address
                </label>

                <input
                  id="receiverAddress"
                  type="text"
                  placeholder="Address"
                  {...register('receiverAddress', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.receiverAddress && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Receiver address is required.
                  </p>
                )}
              </div>

              {/* Receiver Phone */}

              <div className="mb-3">
                <label
                  htmlFor="receiverPhone"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver Contact No
                </label>

                <input
                  id="receiverPhone"
                  type="tel"
                  placeholder="Receiver Contact No"
                  {...register('receiverPhone', {
                    required: true,
                  })}
                  className={inputClass}
                />

                {errors.receiverPhone && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Receiver contact number is required.
                  </p>
                )}
              </div>

              {/* Receiver Region */}

              <div className="mb-3">
                <label
                  htmlFor="receiverRegion"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver Region
                </label>

                <select
                  id="receiverRegion"
                  {...register('receiverRegion', {
                    required: true,
                  })}
                  className={`${inputClass} text-gray-500`}
                >
                  <option value="" disabled>
                    Select receiver Region
                  </option>

                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                {errors.receiverRegion && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Please select receiver region.
                  </p>
                )}
              </div>

              {/* Receiver District */}

              <div className="mb-3">
                <label
                  htmlFor="receiverDistrict"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Receiver District
                </label>

                <select
                  id="receiverDistrict"
                  {...register('receiverDistrict', {
                    required: true,
                  })}
                  disabled={!receiverRegion}
                  className={`${inputClass} text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
                >
                  <option value="" disabled>
                    {receiverRegion
                      ? 'Select receiver District'
                      : 'Select Region First'}
                  </option>

                  {receiverDistricts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                {errors.receiverDistrict && (
                  <p className="mt-1 text-[10px] text-red-500">
                    Please select receiver district.
                  </p>
                )}
              </div>

              {/* Delivery Instruction */}

              <div>
                <label
                  htmlFor="deliveryInstruction"
                  className="mb-1 block text-[11px] font-semibold text-black"
                >
                  Delivery Instruction
                </label>

                <textarea
                  id="deliveryInstruction"
                  placeholder="Delivery Instruction"
                  {...register('deliveryInstruction')}
                  className="h-16 w-full resize-none rounded-md border border-[#d6dde2] bg-white px-2 py-2 text-[11px] text-black outline-none transition duration-200 placeholder:text-[#9aaabd] focus:border-[#b9df45] focus:ring-2 focus:ring-[#b9df45]/20"
                />
              </div>
            </div>
          </div>

          {/* ================= Pickup Time ================= */}

          <p className="mt-7 text-[10px] font-medium text-black">
            * PickUp Time 4pm-7pm Approx.
          </p>

          {/* ================= Submit ================= */}

          <button
            type="submit"
            className="mt-7 h-9 w-[185px] rounded-md bg-primary text-[10px] font-medium text-secondary transition duration-200 hover:brightness-95"
          >
            Proceed to Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendParcel;
