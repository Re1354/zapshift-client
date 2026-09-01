import React from 'react';
import quote from '../../../assets/reviewQuote.png';

const ReviewCard = ({ review }) => {
  const { userName, review: reviewText, user_photoURL } = review;

  return (
    <div
      className="
        h-full
        min-h-[230px]
        rounded-[22px]
        bg-white
        px-6
        py-6
        transition-all
        duration-500
        md:min-h-[265px]
        md:px-6
        md:py-7
      "
    >
      {/* Quote */}
      <div className="mb-3">
        <img className="h-10 w-10" src={quote} alt="" />
      </div>

      {/* Review */}
      <p className="text-[11px] leading-[1.55] text-gray-500 md:text-xs">
        {reviewText}
      </p>

      {/* Divider */}
      <div className="my-5 border-t border-dashed border-secondary/60" />

      {/* User */}
      <div className="flex items-center gap-3">
        {/* Image */}
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-secondary">
          <img
            src={user_photoURL}
            alt={userName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h3 className="text-sm font-bold text-secondary md:text-base">
            {userName}
          </h3>

          <p className="mt-0.5 text-[10px] text-gray-500 md:text-xs">
            Senior Product Designer
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
