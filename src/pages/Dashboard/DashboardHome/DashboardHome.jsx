import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';

const DashboardHome = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <span>Loading</span>;
  }
  if (role === 'admin') {
    return <AdminDashboardHome></AdminDashboardHome>;
  }
  if (role === 'rider') {
    return <RiderDashboardHome></RiderDashboardHome>;
  } else {
    return <UserDashboardHome></UserDashboardHome>;
  }
  return <div>Home</div>;
};

export default DashboardHome;
