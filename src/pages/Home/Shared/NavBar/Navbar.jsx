import React from 'react';
import { NavLink, useNavigate } from 'react-router';

import Logo from '../../../../Components/Logo/Logo';
import useAuth from '../../../../hooks/useAuth';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

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
    `rounded-xl px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-primary text-secondary'
        : 'text-secondary/70 hover:bg-primary/60 hover:text-secondary'
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>

      <li>
        <NavLink to="/services" className={navLinkClass}>
          Services
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
        <NavLink to="/send-parcel" className={navLinkClass}>
          Send Parcel
        </NavLink>
      </li>
      {user && (
        <>
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
    <header className="pt-3 mb-5">
      <div className="navbar min-h-[64px] rounded-2xl bg-white px-4 shadow-sm md:px-5">
        {/* ================= Logo ================= */}
        <div className="navbar-start">
          <NavLink to="/" className="flex items-center hover:bg-transparent">
            <Logo />
          </NavLink>
        </div>

        {/* ================= Desktop Navigation ================= */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal items-center gap-1 p-0">
            {links}
          </ul>
        </div>

        {/* ================= Right Side ================= */}
        <div className="navbar-end gap-2">
          {user ? (
            <>
              {/* ================= Logged In ================= */}

              {/* Logout */}
              <button
                onClick={handleLogOut}
                type="button"
                className="
                  hidden
                  rounded-xl
                  border
                  border-gray-200
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-secondary
                  transition
                  hover:border-secondary/30
                  hover:bg-gray-50
                  md:block
                "
              >
                Logout
              </button>

              {/* Be a Rider */}
              <button
                onClick={handleRiderClick}
                type="button"
                className="
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-secondary
                  transition
                  hover:scale-105
                "
              >
                Be a Rider
              </button>

              {/* Arrow */}
              <button
                onClick={handleRiderClick}
                type="button"
                className="
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#202020]
                  text-lg
                  font-bold
                  text-primary
                  transition
                  hover:scale-105
                  md:flex
                "
                aria-label="Be a Rider"
              >
                ↗
              </button>
            </>
          ) : (
            <>
              {/* ================= Logged Out ================= */}

              {/* Login */}
              <NavLink
                to="/login"
                className="
                  hidden
                  rounded-xl
                  border
                  border-gray-200
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-secondary
                  transition
                  hover:border-secondary/30
                  hover:bg-gray-50
                  md:block
                "
              >
                Login
              </NavLink>

              {/* Sign Up */}
              <NavLink
                to="/register"
                className="
                  hidden
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-secondary
                  transition
                  hover:scale-105
                  md:block
                "
              >
                Sign Up
              </NavLink>

              {/* Be a Rider */}
              <button
                onClick={handleRiderClick}
                type="button"
                className="
                  rounded-xl
                  bg-primary
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-secondary
                  transition
                  hover:scale-105
                "
              >
                Be a Rider
              </button>

              {/* Arrow */}
              <button
                onClick={handleRiderClick}
                type="button"
                className="
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#202020]
                  text-lg
                  font-bold
                  text-primary
                  transition
                  hover:scale-105
                  md:flex
                "
                aria-label="Be a Rider"
              >
                ↗
              </button>
            </>
          )}

          {/* ================= Mobile Menu ================= */}
          <div className="dropdown dropdown-end lg:hidden">
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
                w-52
                rounded-2xl
                bg-white
                p-3
                shadow-lg
              "
            >
              {links}

              {!user ? (
                <>
                  {/* Mobile Login */}
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>

                  {/* Mobile Sign Up */}
                  <li>
                    <NavLink to="/register">Sign Up</NavLink>
                  </li>
                </>
              ) : (
                <>
                  {/* Mobile Logout */}
                  <li>
                    <button
                      onClick={handleLogOut}
                      type="button"
                      className="text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

              {/* Mobile Be a Rider */}
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
      </div>
    </header>
  );
};

export default Navbar;
