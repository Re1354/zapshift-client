import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router';

import useAuth from '../../../hooks/useAuth';
import GoogleLogin from '../SocialLogin/GoogleLogin';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, loading, signInUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // The page user originally wanted to visit
  const rawFrom = location.state?.from?.pathname;
  const targetDestination = rawFrom && rawFrom !== '/login' ? rawFrom : '/';

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      const savedRedirect = sessionStorage.getItem('googleLoginRedirect');
      if (savedRedirect) {
        sessionStorage.removeItem('googleLoginRedirect');
      }
      const dest =
        savedRedirect && savedRedirect !== '/login'
          ? savedRedirect
          : targetDestination;
      console.log('[AUTH] User authenticated, routing away from /login to:', dest);
      navigate(dest, { replace: true });
    }
  }, [user, loading, targetDestination, navigate]);

  const handleLogin = data => {
    signInUser(data.email, data.password)
      .then(result => {
        console.log('Login successful:', result.user);

        // Go back to the page user originally wanted
        navigate(targetDestination, { replace: true });
      })
      .catch(error => {
        console.log('Login error:', error);
      });
  };

  // Wait until Firebase restores auth state before rendering login form
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If already authenticated, do not show login form
  if (user) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Welcome Back
        </h1>

        <p className="mt-1 text-sm text-black">Login with ZapShift</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="space-y-3">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Email
            </label>

            <input
              type="email"
              {...register('email', {
                required: true,
              })}
              className="h-10 w-full rounded-md border border-[#d6dde2] bg-white px-3 text-sm outline-none transition focus:border-secondary"
              placeholder="Email"
            />

            {errors.email?.type === 'required' && (
              <p className="mt-1 text-xs text-red-500">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Password
            </label>

            <input
              type="password"
              {...register('password', {
                required: true,
              })}
              className="h-10 w-full rounded-md border border-[#d6dde2] bg-white px-3 text-sm outline-none transition focus:border-secondary"
              placeholder="Password"
            />

            {errors.password?.type === 'required' && (
              <p className="mt-1 text-xs text-red-500">Password is required</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="pt-0.5">
            <a
              href="#"
              className="text-sm text-gray-500 underline transition hover:text-secondary"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-secondary transition hover:brightness-95"
          >
            Login
          </button>
        </fieldset>
      </form>

      {/* Register Link */}
      <p className="mt-4 text-sm text-gray-500">
        Don't have any account?{' '}
        <NavLink
          state={location.state}
          to="/register"
          className="font-medium text-[#8aaa32] hover:underline"
        >
          Register
        </NavLink>
      </p>

      {/* OR */}
      <div className="my-3 text-center text-sm text-gray-500">Or</div>

      {/* Google Login */}
      <GoogleLogin />
    </div>
  );
};

export default Login;
