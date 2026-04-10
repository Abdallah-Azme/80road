import api from '@/lib/api-client';

export interface StaticPageData {
  title: string | null;
  description: string | null;
  image: string | null;
}

export interface StaticPageResponse {
  status: boolean;
  message: string;
  data: StaticPageData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqResponse {
  status: boolean;
  message: string;
  data: FaqItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any[];
}

export const staticPageService = {
  getTerms: () => api.get<StaticPageResponse>('/pages/terms-conditions'),
  getPrivacy: () => api.get<StaticPageResponse>('/pages/privacy-policy'),
  getFaqs: () => api.get<FaqResponse>('/pages/faqs'),
};
