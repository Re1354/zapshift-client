import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.init';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const GoogleLogin = () => {
  const { signInGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setIsProcessing(true);
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log('Google login successful via redirect:', result.user);
          const token = await result.user.getIdToken();
          
          const userInfo = {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          };

          const res = await axiosSecure.post('/users', userInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('User data has been stored:', res.data);
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Google login redirect error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    handleRedirectResult();
  }, [axiosSecure, from, navigate]);

  const handleSignIn = async () => {
    try {
      setIsProcessing(true);
      await signInGoogle();
    } catch (error) {
      console.log('Google login initiation error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isProcessing}
        className="btn w-full border-[#e5e5e5] bg-white text-black"
      >
        {isProcessing ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : (
          <svg
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
        {isProcessing ? 'Redirecting...' : 'Login with Google'}
      </button>
    </div>
  );
};

export default GoogleLogin;
