import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'البداية السريعة | 80road',
  description: 'ابدأ رحلتك في البحث عن العقار المناسب لك في الكويت من خلال تخصيص تفضيلاتك.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function QuickStartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
