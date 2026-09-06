import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import Logo from '../../../../Components/Logo/Logo';
import useAuth from '../../../../hooks/useAuth';
import useRole from '../../../../hooks/useRole';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { role } = useRole();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log('Logged out successfully');
      })
      .catch(error => {
        console.log('Logout error:', error);
      });
  };

  const handleRiderClick = () => {
    navigate('/rider');
  };

  const navLinkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
      isActive
        ? 'bg-primary text-secondary font-bold'
        : 'text-secondary/75 hover:bg-primary/50 hover:text-secondary'
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/coverage" className={navLinkClass}>
          Coverage
        </NavLink>
      </li>

      <li>
        <NavLink to="/about" className={navLinkClass}>
          About Us
        </NavLink>
      </li>

      <li>
        <NavLink to="/pricing" className={navLinkClass}>
          Pricing
        </NavLink>
      </li>

      <li>
        <NavLink to="/parcel-track" className={navLinkClass}>
          Track Order
        </NavLink>
      </li>

      <li>
        <NavLink to="/rider" className={navLinkClass}>
          Be a Rider
        </NavLink>
      </li>

      <li>
        <NavLink to="/send-parcel" className={navLinkClass}>
          Send Parcel
        </NavLink>
      </li>

      {user && (
        <>
          {/* Dashboard */}
          <li>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </li>

          {/* My Parcels */}
          <li>
            <NavLink to="/dashboard/my-parcels" className={navLinkClass}>
              My Parcels
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="w-full">
      <div
        className="
          flex
          min-h-[64px]
          w-full
          items-center
          justify-between
          rounded-2xl
          bg-white
          px-4
          py-2.5
          shadow-sm
          sm:px-6
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}
        <div className="shrink-0">
          <NavLink to="/" className="flex items-center hover:bg-transparent">
            <Logo />
          </NavLink>
        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="mx-auto hidden items-center xl:flex">
          <ul className="flex items-center gap-1">{links}</ul>
        </nav>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {user ? (
            <>
              {/* Logout */}
              <button
                onClick={handleLogOut}
                type="button"
                className="
                  whitespace-nowrap
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-secondary
                  transition
                  hover:border-secondary/30
                  hover:bg-gray-50
                "
              >
                Logout
              </button>

              {/* Be a Rider */}
              <button
                onClick={handleRiderClick}
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-xl
                  bg-primary
                  py-1.5
                  pl-4
                  pr-1.5
                  text-sm
                  font-bold
                  text-secondary
                  transition
                  hover:brightness-95
                "
              >
                <span>Be a Rider</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#202020] text-xs font-bold text-primary">
                  ↗
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <NavLink
                to="/login"
                className="
                  whitespace-nowrap
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-secondary
                  transition
                  hover:border-secondary/30
                  hover:bg-gray-50
                "
              >
                Sign In
              </NavLink>

              {/* Sign Up */}
              <NavLink
                to="/register"
                className="
                  flex
                  items-center
                  gap-2
                  whitespace-nowrap
                  rounded-xl
                  bg-primary
                  py-1.5
                  pl-4
                  pr-1.5
                  text-sm
                  font-bold
                  text-secondary
                  transition
                  hover:brightness-95
                "
              >
                <span>Sign Up</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#202020] text-xs font-bold text-primary">
                  ↗
                </span>
              </NavLink>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
        <div className="dropdown dropdown-end ml-auto xl:hidden">
          <button
            tabIndex={0}
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <ul
            tabIndex={0}
            className="
              menu
              dropdown-content
              z-50
              mt-3
              w-56
              rounded-2xl
              bg-white
              p-3
              shadow-lg
            "
          >
            {links}

            <div className="my-2 h-px bg-gray-100" />

            {!user ? (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>

                <li>
                  <NavLink to="/register">Sign Up</NavLink>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogOut}
                  type="button"
                  className="text-left"
                >
                  Logout
                </button>
              </li>
            )}

            <li>
              <button
                onClick={handleRiderClick}
                type="button"
                className="text-left"
              >
                Be a Rider
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
