import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إضافة إعلان جديد | 80road',
  description: 'قم بإضافة إعلانك في 80road ليصل إلى آلاف المهتمين بالعقارات في الكويت. شقق، فلل، أراضي، وغيرها.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PostAdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
