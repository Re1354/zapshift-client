import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getRedirectResult, browserPopupRedirectResolver } from 'firebase/auth';

import { auth } from '../../../firebase/firebase.init';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const GoogleLogin = () => {
  const { signInGoogle, signInGoogleRedirect } = useAuth();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonRef = useRef(null);

  const from = location.state?.from?.pathname || '/';

  // Helper function to process successful Google login
  const processSuccessfulLogin = async (user, redirectPath) => {
    try {
      setIsProcessing(true);
      console.log('Google login successful:', user);

      const token = await user.getIdToken();
      console.log('Firebase token received:', !!token);

      const userInfo = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      const res = await axiosSecure.post('/users', userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User data has been stored:', res.data);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Error processing login backend:', error);
      alert('Login succeeded, but failed to connect to backend server.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Check for redirect result on component mount
  useEffect(() => {
    let mounted = true;
    
    const checkRedirect = async () => {
      try {
        setIsProcessing(true);
        // Using browserPopupRedirectResolver ensures it resolves correctly even with third-party cookie restrictions
        const result = await getRedirectResult(auth, browserPopupRedirectResolver);
        
        if (result && mounted) {
          const savedPath = sessionStorage.getItem('googleLoginRedirect') || '/';
          sessionStorage.removeItem('googleLoginRedirect');
          await processSuccessfulLogin(result.user, savedPath);
        } else if (mounted) {
          setIsProcessing(false);
        }
      } catch (error) {
        if (mounted) {
          setIsProcessing(false);
          console.error('Redirect result error:', error);
          if (error.code === 'auth/unauthorized-domain') {
            alert('Configuration Error: This domain is not authorized for OAuth operations. Please add exactly this domain (without https://) to Firebase Authorized Domains.');
          } else {
            alert('Google Login redirect failed. Please try again or use Email/Password.');
          }
        }
      }
    };

    checkRedirect();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignIn = useCallback(
    (e) => {
      if (e) e.preventDefault();
      setIsProcessing(true);

      // Attempt primary method: Popup
      signInGoogle()
        .then((result) => {
          return processSuccessfulLogin(result.user, from);
        })
        .catch((error) => {
          console.log('Popup login failed, analyzing error:', error.code);
          
          if (
            error.code === 'auth/popup-blocked' ||
            error.code === 'auth/cancelled-popup-request' ||
            error.code === 'auth/popup-closed-by-user'
          ) {
            console.log('Popup blocked or closed, falling back to redirect...');
            // Save the intended destination before redirecting
            sessionStorage.setItem('googleLoginRedirect', from);
            
            // Execute the fallback: Redirect
            signInGoogleRedirect().catch(redirectErr => {
              setIsProcessing(false);
              console.error('Redirect fallback failed immediately:', redirectErr);
            });
          } else if (error.code === 'auth/unauthorized-domain') {
            setIsProcessing(false);
            alert('Configuration Error: This domain is not authorized in Firebase Console. Please add exactly this domain (no https://) to Firebase Authorized Domains.');
          } else {
            setIsProcessing(false);
            console.error('Unhandled Google login error:', error);
            alert(`Login failed: ${error.message}`);
          }
        });
    },
    [signInGoogle, signInGoogleRedirect, from]
  );

  // Attach native event listener
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
