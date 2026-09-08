import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import useAuth from '../../../hooks/useAuth';

const GoogleLogin = () => {
  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const rawFrom = location.state?.from?.pathname;
  const targetDestination = rawFrom && rawFrom !== '/login' ? rawFrom : '/';

  const handleGoogleClick = async e => {
    if (e) e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      console.log('[AUTH] Starting Google signInWithPopup...');
      const result = await signInGoogle();
      console.log('[AUTH] Google popup succeeded for:', result.user.email);
      console.log('[AUTH] Navigating to:', targetDestination);
      navigate(targetDestination, { replace: true });
    } catch (error) {
      console.log('[AUTH] Google popup error code:', error.code, error.message);

      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        // User closed or dismissed the popup - do not trigger redirect fallback
        console.log('[AUTH] Google popup was closed or cancelled by user.');
      } else if (error.code === 'auth/popup-blocked') {
        Swal.fire({
          icon: 'warning',
          title: 'Popup Blocked',
          text: 'Please allow popups for this site in your browser to sign in with Google.',
          confirmButtonColor: '#003b40',
        });
      } else if (error.code === 'auth/unauthorized-domain') {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized Domain',
          text: 'This domain is not authorized in Firebase Console. Please add zapshift-client.vercel.app to Firebase Authorized Domains.',
          confirmButtonColor: '#003b40',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sign-In Error',
          text: error.message || 'Failed to sign in with Google.',
          confirmButtonColor: '#003b40',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleClick}
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
