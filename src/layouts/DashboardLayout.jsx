import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import Navbar from '../pages/Home/Shared/NavBar/Navbar';
import Logo from '../Components/Logo/Logo';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary text-secondary'
        : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
    }`;

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      {/* ================= Desktop Sidebar ================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[180px] border-r border-gray-100 bg-white lg:block">
        {/* Logo */}
        <div className="flex h-[60px] items-center border-b border-gray-100 px-4">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-secondary"
          >
            <Logo></Logo>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex h-[calc(100vh-52px)] flex-col px-3 py-3">
          {/* Menu Title */}
          <p className="mb-2 px-2 text-[10px] font-medium uppercase text-gray-500">
            Menu
          </p>

          {/* Main Menu */}
          <nav className="space-y-1">
            {/* Dashboard */}
            <NavLink to="/dashboard" end className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>

              <span>Dashboard</span>
            </NavLink>

            {/* My Parcels */}
            <NavLink to="/dashboard/my-parcels" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 8h10" />
                <path d="M7 12h6" />
                <path d="M7 16h4" />
              </svg>

              <span>My Parcels</span>
            </NavLink>

            {/* Add Parcel */}
            <NavLink to="/send-parcel" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

              <span>Add Parcel</span>
            </NavLink>

            {/* Payment History */}
            <NavLink to="/dashboard/payment-history" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h3" />
              </svg>

              <span>Payments</span>
            </NavLink>

            {/* Profile */}
            <NavLink to="/dashboard/profile" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c.8-3.5 3.2-5 7-5s6.2 1.5 7 5" />
              </svg>

              <span>Profile</span>
            </NavLink>

            {/* rider only route  */}
            {role === 'rider' && (
              <>
                <NavLink
                  to="/dashboard/assigned-deliveries"
                  className={navLinkClass}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {/* Truck */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h11v11H3z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4l3 3v4h-7z"
                    />

                    {/* Wheels */}
                    <circle cx="7" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />

                    {/* Assignment check */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10l2 2 4-4"
                    />
                  </svg>

                  <span>Assigned Deliveries</span>
                </NavLink>
              </>
            )}
            {/* admin only route  */}
            {role === 'admin' && (
              <>
                <NavLink
                  to="/dashboard/approve-riders"
                  className={navLinkClass}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="7" cy="17" r="3" />
                    <circle cx="18" cy="17" r="3" />

                    <path d="M7 17l3-7h4l4 7" />
                    <path d="M10 10l3 7" />
                    <path d="M10 10h-2" />

                    <circle cx="12" cy="5" r="2.5" />
                    <path d="M10.5 8l2.5 2 3-1" />

                    <path d="M16 9l2 2 1.5-2" />
                  </svg>

                  <span>Approve Riders</span>
                </NavLink>

                <NavLink
                  to="/dashboard/users-management"
                  className={navLinkClass}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />

                    <circle cx="17" cy="9" r="2.5" />
                    <path d="M15.5 14.5c2.8-.2 4.6 1.4 5 4.5" />
                  </svg>

                  <span>Users Management</span>
                </NavLink>

                <NavLink to="/dashboard/assign-riders" className={navLinkClass}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
                    <path d="M15 15l2 2 4-4" />
                  </svg>

                  <span>Assign Riders</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-gray-100" />

          {/* General */}
          <p className="mb-2 px-2 text-[10px] font-medium uppercase text-gray-500">
            General
          </p>

          <nav className="space-y-1">
            {/* Settings */}
            <NavLink to="/dashboard/settings" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4v-2.6h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.6h-.1a1.7 1.7 0 0 0-1.6 1z" />
              </svg>

              <span>Settings</span>
            </NavLink>

            {/* Help */}
            <NavLink to="/dashboard/help" className={navLinkClass}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.8 9a2.4 2.4 0 1 1 3.8 2c-1.2.8-1.6 1.2-1.6 2.4" />
                <path d="M12 17h.01" />
              </svg>

              <span>Help</span>
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
              </svg>

              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= Main Area ================= */}

      <div className="lg:ml-[180px]">
        {/* ================= Top Navbar ================= */}

        <header className="sticky top-0 z-30 h-[60px] border-b border-gray-100 bg-white">
          <div className="flex h-full items-center justify-between px-4 md:px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                type="button"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>

              {/* Desktop Toggle Icon */}
              <button
                type="button"
                className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:block"
                aria-label="Toggle sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Notification */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>
              </button>

              {/* User */}
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                      {user?.displayName?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="hidden leading-tight sm:block">
                  <p className="text-xs font-semibold text-gray-800">
                    {user?.displayName || 'User'}
                  </p>

                  <p className="text-[10px] text-gray-500">User</p>
                </div>

                {/* Dropdown */}
                <button
                  type="button"
                  className="hidden p-1 text-gray-500 sm:block"
                  aria-label="User menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ================= Page Content ================= */}

        <main className="min-h-[calc(100vh-52px)] bg-[#f1f3f4] p-4 md:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
