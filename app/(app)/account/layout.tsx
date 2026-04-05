import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حسابي | 80road',
  description: 'لوحة التحكم الخاصة بك في 80road. تصفح إعلاناتك، قائمتك المفضلة، وتحكم في حسابك.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
