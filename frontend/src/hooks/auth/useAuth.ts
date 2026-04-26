import { useMutation } from '@tanstack/react-query';
import { authApi, userApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { LoginPayload, RegisterPayload } from '@/types';

export const useLogin = () => {
  const setAuth = useAuthStore(s => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: ({ data }) => setAuth(data.user, data.accessToken),
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore(s => s.clearAuth);
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clearAuth(),
  });
};

export const useRegister = () =>
  useMutation({ mutationFn: (data: RegisterPayload) => userApi.register(data) });
