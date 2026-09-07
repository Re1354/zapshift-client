import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { NavLink, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import ImgUpIcon from '../../../assets/image-upload-icon.png';
import useAuth from '../../../hooks/useAuth';
import GoogleLogin from '../SocialLogin/GoogleLogin';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
  const [photoPreview, setPhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user, loading, registerUser, updateUserProfile } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  // Keep the original destination
  const rawFrom = location.state?.from?.pathname;
  const targetDestination =
    rawFrom && rawFrom !== '/login' && rawFrom !== '/register' ? rawFrom : '/';

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      const savedRedirect = sessionStorage.getItem('googleLoginRedirect');
      if (savedRedirect) {
        sessionStorage.removeItem('googleLoginRedirect');
      }
      const dest =
        savedRedirect && savedRedirect !== '/login' && savedRedirect !== '/register'
          ? savedRedirect
          : targetDestination;
      console.log('[AUTH] User authenticated, routing away from /register to:', dest);
      navigate(dest, { replace: true });
    }
  }, [user, loading, targetDestination, navigate]);

  // ================= Photo Preview =================
  const handlePhotoChange = e => {
    const file = e.target.files?.[0];

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ================= Clean Preview URL =================
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // ================= Registration =================
  const handleRegistration = async data => {
    try {
      // 1. Create Firebase user
      const result = await registerUser(data.email, data.password);

      // 2. Get selected photo
      const profileImg = data.photo?.[0];

      if (!profileImg) {
        console.log('No profile photo selected');
        return;
      }

      // 3. Upload photo to ImgBB
      const formData = new FormData();
      formData.append('image', profileImg);

      const imageApiUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_image_host_key}`;

      const imageResponse = await axios.post(imageApiUrl, formData);

      const photoURL = imageResponse.data.data.url;

      const userInfo = {
        email: data.email,
        displayName: data.name,
        photoURL: photoURL,
      };

      // 4. Update Firebase user profile
      const userProfile = {
        displayName: data.name,
        photoURL: photoURL,
      };

      axiosSecure.post('/users', userInfo).then(res => {
        if (res.data.insertedId) {
          console.log('User created in the database');
        }
      });

      await updateUserProfile(userProfile);

      console.log('User profile updated successfully');

      // 5. Redirect to original destination
      navigate(targetDestination, { replace: true });
    } catch (error) {
      console.error('Registration error:', error);

      // ================= Email Already Exists =================
      if (error.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Email Already Exists',
          text: 'Please login with this email instead.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
      } else {
        // ================= Other Registration Errors =================
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message || 'Something went wrong. Please try again.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
      }
    }
  };

  // Wait until Firebase restores auth state before rendering register form
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If already authenticated, do not show register form
  if (user) {
    return null;
  }

  return (
    <div className="w-full">
      {/* ================= Heading ================= */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-black">
          Create an Account
        </h1>

        <p className="mt-1 text-sm text-black">Register with ZapShift</p>
      </div>

      {/* ================= Registration Form ================= */}
      <form onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="space-y-3">
          {/* ================= Profile Photo ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Profile Photo
            </label>

            <label
              htmlFor="photo"
              className={`flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-3 py-2.5 transition ${
                photoPreview
                  ? 'border-primary bg-[#f8fceb]'
                  : 'border-[#d6dde2] bg-[#fafafa] hover:border-primary hover:bg-[#f8fceb]'
              }`}
            >
              {/* Photo Preview */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f1]">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={ImgUpIcon}
                    alt="Upload profile photo"
                    className="h-6 w-6 object-contain"
                  />
                )}
              </div>

              {/* Upload Text */}
              <div className="min-w-0 flex-1">
                {photoPreview ? (
                  <>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-secondary">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-secondary">
                        ✓
                      </span>
                      Photo uploaded
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Click to change photo
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-secondary">
                      Upload your profile photo
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Click here to choose a photo
                    </p>
                  </>
                )}
              </div>
            </label>

            {/* Hidden File Input */}
            <input
              id="photo"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              {...register('photo', {
                required: true,
                onChange: handlePhotoChange,
              })}
              className="hidden"
            />

            {/* Photo Error */}
            {errors.photo?.type === 'required' && (
              <p className="mt-1 text-xs text-red-500">
                Please upload your profile photo.
              </p>
            )}
          </div>

          {/* ================= Name ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Name
            </label>

            <input
              type="text"
              {...register('name', {
                required: true,
              })}
              className="h-10 w-full rounded-md border border-[#d6dde2] bg-white px-3 text-sm outline-none transition focus:border-secondary"
              placeholder="Name"
            />

            {errors.name?.type === 'required' && (
              <p className="mt-1 text-xs text-red-500">Name is required</p>
            )}
          </div>

          {/* ================= Email ================= */}
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

          {/* ================= Password ================= */}
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Password
            </label>

            <input
              type="password"
              {...register('password', {
                required: true,

                minLength: {
                  value: 6,
                  message: 'Password must be 6 characters or longer.',
                },

                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/,
                  message:
                    'Password must contain at least one uppercase letter, one lowercase letter, and one special character.',
                },
              })}
              className="h-10 w-full rounded-md border border-[#d6dde2] bg-white px-3 text-sm outline-none transition focus:border-secondary"
              placeholder="Password"
            />

            {errors.password?.type === 'required' && (
              <p className="mt-1 text-xs text-red-500">Password is required</p>
            )}

            {errors.password?.type === 'minLength' && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}

            {errors.password?.type === 'pattern' && (
              <p className="mt-1 text-xs leading-4 text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ================= Register Button ================= */}
          <button
            type="submit"
            className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-secondary transition hover:brightness-95"
          >
            Register
          </button>
        </fieldset>
      </form>

      {/* ================= Login Link ================= */}
      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{' '}
        <NavLink
          to="/login"
          state={location.state}
          className="font-medium text-[#8aaa32] hover:underline"
        >
          Login
        </NavLink>
      </p>

      {/* ================= OR ================= */}
      <div className="my-3 text-center text-sm text-gray-500">Or</div>

      {/* ================= Google Login ================= */}
      <GoogleLogin />
    </div>
  );
};

export default Register;
