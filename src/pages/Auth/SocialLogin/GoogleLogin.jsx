import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const GoogleLogin = () => {
  const { signInGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonRef = useRef(null);

  const from = location.state?.from?.pathname || '/';

  const handleSignIn = useCallback(
    (e) => {
      // Prevent default to be safe
      if (e) e.preventDefault();

      // Native DOM event guarantees synchronous execution for popup blockers
      signInGoogle()
        .then(async (result) => {
          setIsProcessing(true);
          console.log('Google login successful:', result.user);

          // Get Firebase ID token
          const token = await result.user.getIdToken();
          console.log('Firebase token received:', !!token);

          const userInfo = {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };

          // Send token directly with this request
          const res = await axiosSecure.post('/users', userInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('User data has been stored:', res.data);
          navigate(from, { replace: true });
        })
        .catch((error) => {
          console.log('Google login error:', error);
          console.log('Backend response:', error?.response?.data);

          if (error.code === 'auth/popup-blocked') {
            alert(
              'Your browser blocked the Google Login popup. Please allow popups for this site, or check if the domain is added to Firebase Authorized Domains.'
            );
          }
        })
        .finally(() => {
          setIsProcessing(false);
        });
    },
    [signInGoogle, axiosSecure, from, navigate]
  );

  // Attach native event listener to bypass React's synthetic event batching delays
  useEffect(() => {
    const btn = buttonRef.current;
    if (btn) {
      btn.addEventListener('click', handleSignIn);
      return () => btn.removeEventListener('click', handleSignIn);
    }
  }, [handleSignIn]);

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        disabled={isProcessing}
        className="btn w-full border-[#e5e5e5] bg-white text-black relative"
      >
        {isProcessing ? (
          <span className="loading loading-spinner text-primary pointer-events-none"></span>
        ) : (
          <svg
            className="pointer-events-none"
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff" />
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              />
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              />
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              />
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              />
            </g>
          </svg>
        )}
        <span className="pointer-events-none">
          {isProcessing ? 'Logging in...' : 'Login with Google'}
        </span>
      </button>
    </div>
  );
};

export default GoogleLogin;
