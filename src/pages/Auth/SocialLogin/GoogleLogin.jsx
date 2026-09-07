import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getRedirectResult } from 'firebase/auth';
import axios from 'axios';

import { auth } from '../../../firebase/firebase.init';
import useAuth from '../../../hooks/useAuth';

const GoogleLogin = () => {
  const { signInGoogle, signInGoogleRedirect } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const rawFrom = location.state?.from?.pathname;
  const targetDestination = rawFrom && rawFrom !== '/login' ? rawFrom : '/';

  // Helper function to sync user with backend and redirect
  const processSuccessfulLogin = async (firebaseUser, redirectPath) => {
    try {
      setIsProcessing(true);
      console.log('[AUTH] Processing Google login for:', firebaseUser.email);

      const token = await firebaseUser.getIdToken();
      console.log('[AUTH] Firebase ID token acquired.');

      const userInfo = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
      };

      // Sync user to backend using direct axios request (no auto-logout interceptor)
      try {
        const res = await axios.post(
          'https://zap-shift-server-bay-eight.vercel.app/users',
          userInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('[AUTH] User record synced with backend:', res.data);
      } catch (backendError) {
        console.warn(
          '[AUTH] Backend user sync warning (non-fatal):',
          backendError.response?.data || backendError.message,
        );
      }

      console.log('[AUTH] Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('[AUTH] Login processing error:', error);
      navigate(redirectPath, { replace: true });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check for redirect result on component mount (if coming back from a full-page redirect)
  useEffect(() => {
    let isMounted = true;

    getRedirectResult(auth)
      .then(async result => {
        if (result?.user && isMounted) {
          const savedPath =
            sessionStorage.getItem('googleLoginRedirect') || targetDestination;
          sessionStorage.removeItem('googleLoginRedirect');
          await processSuccessfulLogin(result.user, savedPath);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error('[AUTH] Redirect result error:', error);
          if (error.code === 'auth/unauthorized-domain') {
            alert(
              'Configuration Error: This domain is not authorized for OAuth in Firebase Console.',
            );
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGoogleClick = async e => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      console.log('[AUTH] Starting Google signInWithPopup...');
      const result = await signInGoogle();
      console.log('[AUTH] Google popup succeeded for:', result.user.email);
      await processSuccessfulLogin(result.user, targetDestination);
    } catch (error) {
      console.error('[AUTH] Google Sign-In error:', error.code, error.message);
      setIsProcessing(false);

      if (error.code === 'auth/popup-blocked') {
        console.log('[AUTH] Popup blocked, falling back to redirect...');
        sessionStorage.setItem('googleLoginRedirect', targetDestination);
        try {
          await signInGoogleRedirect();
        } catch (redirectErr) {
          console.error('[AUTH] Redirect fallback failed:', redirectErr);
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('[AUTH] User closed Google popup.');
      } else if (error.code === 'auth/unauthorized-domain') {
        alert(
          'Configuration Error: This domain is not authorized in Firebase Console. Please add zapshift-client.vercel.app to Firebase Authorized Domains.',
        );
      } else {
        alert(`Google Sign-In failed: ${error.message}`);
      }
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
