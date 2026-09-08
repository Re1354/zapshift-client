import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

import useAuth from '../../../hooks/useAuth';

const GoogleLogin = () => {
  const { signInGoogle, signInGoogleRedirect } = useAuth();
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
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/popup-closed-by-user'
      ) {
        console.log('[AUTH] Popup blocked or closed, executing redirect fallback...');
        sessionStorage.setItem('googleLoginRedirect', targetDestination);
        try {
          await signInGoogleRedirect();
        } catch (redirectErr) {
          console.error('[AUTH] Redirect fallback failed:', redirectErr);
          sessionStorage.removeItem('googleLoginRedirect');
          setIsProcessing(false);
          alert(`Google Sign-In failed: ${redirectErr.message}`);
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        setIsProcessing(false);
        alert(
          'Configuration Error: This domain is not authorized in Firebase Console. Please add zapshift-client.vercel.app to Firebase Authorized Domains.',
        );
      } else {
        setIsProcessing(false);
        alert(`Google Sign-In failed: ${error.message}`);
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
