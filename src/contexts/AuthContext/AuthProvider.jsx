import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile,
  browserPopupRedirectResolver,
} from 'firebase/auth';

import { AuthContext } from './AuthContext';
import { auth } from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(
      auth,
      googleProvider,
      browserPopupRedirectResolver,
    );
  };

  const signInGoogleRedirect = () => {
    setLoading(true);
    return signInWithRedirect(
      auth,
      googleProvider,
      browserPopupRedirectResolver,
    );
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = profile => {
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    let isMounted = true;
    const hasRedirect =
      typeof window !== 'undefined' &&
      !!sessionStorage.getItem('googleLoginRedirect');

    // Check for redirect result on app initialization
    getRedirectResult(auth, browserPopupRedirectResolver)
      .then(async result => {
        if (result?.user && isMounted) {
          console.log('[AUTH] Redirect user authenticated:', result.user.email);
          setUser(result.user);

          // Sync user to backend using direct axios request
          try {
            const token = await result.user.getIdToken();
            const userInfo = {
              email: result.user.email,
              displayName: result.user.displayName || '',
              photoURL: result.user.photoURL || '',
            };
            await axios.post(
              'https://zap-shift-server-bay-eight.vercel.app/users',
              userInfo,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log('[AUTH] Redirect user synced with backend.');
          } catch (syncErr) {
            console.warn(
              '[AUTH] Backend sync notice (non-fatal):',
              syncErr?.response?.data || syncErr?.message,
            );
          }
        }
      })
      .catch(error => {
        console.error('[AUTH] getRedirectResult error:', error);
      })
      .finally(() => {
        if (hasRedirect && isMounted) {
          setLoading(false);
        }
      });

    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      console.log('[AUTH STATE CHANGED]', currentUser ? currentUser.email : 'No user');
      const isRedirectPending =
        typeof window !== 'undefined' &&
        !!sessionStorage.getItem('googleLoginRedirect');

      // If resolving a redirect, keep loading true until getRedirectResult resolves
      if (!isRedirectPending || currentUser) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unSubscribe();
    };
  }, []);

  const authInfo = {
    registerUser,
    signInUser,
    signInGoogle,
    signInGoogleRedirect,
    user,
    loading,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
