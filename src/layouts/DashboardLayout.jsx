import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import Logo from '../Components/Logo/Logo';
import useRole from '../hooks/useRole';

const NavItem = ({ to, end, icon, label, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-secondary font-bold shadow-xs'
          : 'text-gray-600 hover:bg-gray-100 hover:text-secondary'
      }`
    }
  >
    {icon}
    <span className="truncate">{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile / Tablet Drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key and lock body scroll when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  /**
   * Render role-dependent navigation items
   */
  const renderNavItems = (onItemClick) => {
    return (
      <>
        {/* Dashboard Home (All Roles) */}
        <NavItem
          to="/dashboard"
          end
          onClick={onItemClick}
          label="Dashboard"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
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
          }
        />

        {/* ========================================================
            USER ROLE NAVIGATION
        ========================================================= */}
        {role === 'user' && (
          <>
            {/* My Parcels */}
            <NavItem
              to="/dashboard/my-parcels"
              onClick={onItemClick}
              label="My Parcels"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
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
              }
            />

            {/* Add Parcel */}
            <NavItem
              to="/send-parcel"
              onClick={onItemClick}
              label="Add Parcel"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              }
            />

            {/* Payment History */}
            <NavItem
              to="/dashboard/payment-history"
              onClick={onItemClick}
              label="Payments"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                  <path d="M7 15h3" />
                </svg>
              }
            />
          </>
        )}

        {/* ========================================================
            RIDER ROLE NAVIGATION
        ========================================================= */}
        {role === 'rider' && (
          <>
            {/* Assigned Deliveries */}
            <NavItem
              to="/dashboard/assigned-deliveries"
              onClick={onItemClick}
              label="Assigned Deliveries"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h11v11H3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l2 2 4-4" />
                </svg>
              }
            />

            {/* Completed Deliveries */}
            <NavItem
              to="/dashboard/completed-deliveries"
              onClick={onItemClick}
              label="Completed Deliveries"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
                </svg>
              }
            />
          </>
        )}

        {/* ========================================================
            ADMIN ROLE NAVIGATION
        ========================================================= */}
        {role === 'admin' && (
          <>
            {/* Approve Riders */}
            <NavItem
              to="/dashboard/approve-riders"
              onClick={onItemClick}
              label="Approve Riders"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
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
              }
            />

            {/* Users Management */}
            <NavItem
              to="/dashboard/users-management"
              onClick={onItemClick}
              label="Users Management"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
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
              }
            />

            {/* Assign Riders */}
            <NavItem
              to="/dashboard/assign-riders"
              onClick={onItemClick}
              label="Assign Riders"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
                  <path d="M15 15l2 2 4-4" />
                </svg>
              }
            />
          </>
        )}

        {/* Profile (Available to all roles) */}
        <NavItem
          to="/dashboard/profile"
          onClick={onItemClick}
          label="Profile"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M5 20c.8-3.5 3.2-5 7-5s6.2 1.5 7 5" />
            </svg>
          }
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f4]">
      {/* ========================================================
          MOBILE & TABLET DRAWER (OFF-CANVAS)
      ========================================================= */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[270px] max-w-[85vw] flex-col border-r border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex h-[60px] items-center justify-between border-b border-gray-100 px-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center"
          >
            <Logo />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-secondary"
            aria-label="Close navigation menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Role Card */}
        <div className="border-b border-gray-100 bg-gray-50/70 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-xs">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User profile'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-secondary">
                  {user?.displayName?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-secondary">
                {user?.displayName || 'User'}
              </p>
              <p className="truncate text-[11px] text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-md bg-primary/30 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-secondary">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Nav Items */}
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {role} Menu
          </p>

          <nav className="space-y-1">
            {renderNavItems(() => setIsMobileMenuOpen(false))}
          </nav>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100" />

          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            General
          </p>

          <nav className="space-y-1">
            <NavItem
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              label="Back to Website"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
            />

            <NavItem
              to="/parcel-track"
              onClick={() => setIsMobileMenuOpen(false)}
              label="Track Order"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35"
                  />
                </svg>
              }
            />
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[190px] border-r border-gray-100 bg-white lg:block">
        {/* Logo */}
        <div className="flex h-[60px] items-center border-b border-gray-100 px-4">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex h-[calc(100vh-60px)] flex-col px-3 py-3">
          {/* Menu Title + Role Tag */}
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Menu
            </p>
            <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-secondary">
              {role}
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">{renderNavItems()}</nav>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100" />

          {/* General */}
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            General
          </p>

          <nav className="space-y-1">
            <NavItem
              to="/"
              label="Website"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
            />
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
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
      ========================================================= */}
      <div className="lg:ml-[190px]">
        {/* ================= Top Navbar ================= */}
        <header className="sticky top-0 z-30 h-[60px] border-b border-gray-100 bg-white">
          <div className="flex h-full items-center justify-between px-4 md:px-6">
            {/* Left: 3-Line Nav Icon (Mobile / Tablet) + Brand Logo */}
            <div className="flex items-center gap-3">
              {/* 3-Line Hamburger Button (Opens mobile/tablet sidebar) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs transition hover:bg-gray-100 hover:text-secondary active:scale-95 lg:hidden"
                aria-label="Open navigation menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Mobile / Tablet Logo */}
              <div className="lg:hidden">
                <Link to="/" className="flex items-center">
                  <Logo />
                </Link>
              </div>

              {/* Desktop Greeting */}
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-secondary">
                  ZapShift Dashboard
                </p>
              </div>
            </div>

            {/* Right: Role Badge + Notification + User Info */}
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <span className="rounded-full bg-primary/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
                {role}
              </span>

              {/* User Avatar & Info */}
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-gray-50"
                title="View Profile"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-600">
                      {user?.displayName?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </span>
                  )}
                </div>

                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-gray-800">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-[10px] font-medium capitalize text-gray-500">
                    {role || 'User'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* ================= Page Content ================= */}
        <main className="min-h-[calc(100vh-60px)] bg-[#f1f3f4] p-4 md:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
