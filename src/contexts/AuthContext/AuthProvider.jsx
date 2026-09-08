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

  // Sync user with backend MongoDB database safely
  const syncUserWithBackend = async firebaseUser => {
    if (!firebaseUser?.email) return;
    try {
      const token = await firebaseUser.getIdToken();
      const userInfo = {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
      };
      await axios.post(
        'https://zap-shift-server-bay-eight.vercel.app/users',
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 8000,
        },
      );
      console.log('[AUTH] User record synced with backend:', firebaseUser.email);
    } catch (syncErr) {
      console.warn(
        '[AUTH] Backend user sync warning (non-fatal):',
        syncErr?.response?.data || syncErr?.message,
      );
    }
  };

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(
        auth,
        googleProvider,
        browserPopupRedirectResolver,
      );
      if (result?.user) {
        await syncUserWithBackend(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
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
          await syncUserWithBackend(result.user);
        }
      })
      .catch(error => {
        console.error('[AUTH] getRedirectResult error:', error);
      })
      .finally(() => {
        // Always clean up redirect flag so loading state is never locked
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('googleLoginRedirect');
        }
        if (hasRedirect && isMounted) {
          setLoading(false);
        }
      });

    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      console.log('[AUTH STATE CHANGED]', currentUser ? currentUser.email : 'No user');
      if (isMounted) {
        setUser(currentUser);
        const isRedirectPending =
          typeof window !== 'undefined' &&
          !!sessionStorage.getItem('googleLoginRedirect');

        // If resolving a redirect, keep loading true until getRedirectResult resolves
        if (!isRedirectPending || currentUser) {
          setLoading(false);
        }
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
    syncUserWithBackend,
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
