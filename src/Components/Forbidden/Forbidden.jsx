import React from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router';

const Forbidden = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#eef0f1] px-4">
      <div className="w-full max-w-[520px] rounded-2xl border border-[#dfe4e6] bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff4f4]">
          <FaLock className="text-2xl text-red-500" />
        </div>

        {/* Status */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-red-500">
          403 Forbidden
        </p>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-[#003b40] sm:text-3xl">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mx-auto mb-7 max-w-[400px] text-sm leading-6 text-[#718096]">
          Sorry, you don't have permission to access this page. Please contact
          an administrator if you think this is a mistake.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#c6ef52] px-5 text-sm font-semibold text-black transition hover:bg-[#b9e83e]"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
