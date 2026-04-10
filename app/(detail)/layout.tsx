import { AuthGuard } from '@/components/layout/AuthGuard';

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

