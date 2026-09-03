import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: role = 'user',
    isLoading: roleLoading,
    isError,
  } = useQuery({
    queryKey: ['user-role', user?.email],

    queryFn: async () => {
      const res = await axiosSecure.get('/users/role');

      return res.data?.role || 'user';
    },

    enabled: !!user?.email,
  });

  return {
    role,
    roleLoading,
    isError,
  };
};

export default useRole;
