import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearStore = useUserStore((s) => s.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    // We don't clear the store in onMutate anymore to ensure the 
    // Authorization header is sent with the logout request.
    onSuccess: () => {
      toast.success('تم تسجيل الخروج بنجاح');
    },
    onSettled: () => {
      // Always clear store and redirect, even if API fails
      clearStore();
      queryClient.clear();
      router.replace('/auth');
    },
    meta: {
      hideToast: true, // Custom flag to tell global QueryClient to be quiet
    },
  });
};
