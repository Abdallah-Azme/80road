import { Office, OfficeSchema } from '@/lib/types';
import { z } from 'zod';
import { Listing } from '@/lib/types';
import { DEMO_ADS } from '@/features/home/services/listings.service';

// ── Demo data ─────────────────────────────────────────────────
export const DEMO_OFFICES: Office[] = [
  {
    id: 'off_1', officeName: 'مكتب الدانة العقاري', username: 'aldana_realestate',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop',
    bio: 'نحن في مكتب الدانة العقاري نسعى لتوفير أفضل الفرص السكنية والاستثمارية لعملائنا الكرام.',
    governorate: 'محافظة حولي', yearsExperience: 15, activeListingsCount: 42,
    soldOrRentedCount: 150, totalViews: 12500, rating: 4.8, responseTime: 'خلال 15 دقيقة',
    phone: '99991111', whatsapp: '99991111', verified: true,
    specialties: ['بيع', 'إيجار', 'تجاري'],
    sampleListings: [DEMO_ADS[0], DEMO_ADS[2]],
  },
  {
    id: 'off_2', officeName: 'مكتب أبراج الكويت العقاري', username: 'kuwait_towers_re',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
    bio: 'خبرة عريقة في مجال الوساطة العقارية. متخصصون في بيع وشراء الأراضي والفلل.',
    governorate: 'محافظة العاصمة', yearsExperience: 20, activeListingsCount: 35,
    soldOrRentedCount: 300, totalViews: 18200, rating: 4.9, responseTime: 'خلال ساعة',
    phone: '99992222', whatsapp: '99992222', verified: true,
    specialties: ['أراضي', 'فلل', 'استثماري'],
    sampleListings: [DEMO_ADS[1]],
  },
  {
    id: 'off_3', officeName: 'مكتب الصفوة العقاري', username: 'alsafwa_re',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&auto=format&fit=crop',
    bio: 'شريكك الموثوق في عالم العقار. نقدم خدمات التقييم وإدارة الأملاك.',
    governorate: 'محافظة الفروانية', yearsExperience: 8, activeListingsCount: 28,
    soldOrRentedCount: 80, totalViews: 5600, rating: 4.5, responseTime: 'خلال 30 دقيقة',
    phone: '99993333', whatsapp: '99993333', verified: false,
    specialties: ['إدارة أملاك', 'إيجار'],
    sampleListings: [DEMO_ADS[3]],
  },
  {
    id: 'off_4', officeName: 'مكتب المروج للوساطة', username: 'almurouj_brokerage',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
    bio: 'متخصصون في تسويق المشاريع الكبرى وتوفير الفرص الاستثمارية.',
    governorate: 'محافظة الأحمدي', yearsExperience: 12, activeListingsCount: 55,
    soldOrRentedCount: 210, totalViews: 14000, rating: 4.7, responseTime: 'خلال ساعتين',
    phone: '99994444', whatsapp: '99994444', verified: true,
    specialties: ['مشاريع', 'تجاري', 'شاليهات'],
    sampleListings: [DEMO_ADS[1]],
  },
  {
    id: 'off_5', officeName: 'مكتب السهل الذهبي', username: 'golden_plain',
    logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=300&auto=format&fit=crop',
    bio: 'نجعل عملية بيع وشراء عقارك سهلة وسريعة.',
    governorate: 'محافظة مبارك الكبير', yearsExperience: 5, activeListingsCount: 18,
    soldOrRentedCount: 45, totalViews: 3200, rating: 4.2, responseTime: 'خلال 10 دقائق',
    phone: '99995555', whatsapp: '99995555', verified: false,
    specialties: ['سكني', 'إيجار'],
    sampleListings: [DEMO_ADS[2]],
  },
  {
    id: 'off_6', officeName: 'مكتب ركائز العقار', username: 'rakaez_realestate',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=300&auto=format&fit=crop',
    bio: 'الركيزة الأساسية لاستثمارك الناجح.',
    governorate: 'محافظة الجهراء', yearsExperience: 10, activeListingsCount: 60,
    soldOrRentedCount: 120, totalViews: 9800, rating: 4.6, responseTime: 'خلال يوم',
    phone: '99996666', whatsapp: '99996666', verified: true,
    specialties: ['بيوت حكومي', 'قسائم'],
    sampleListings: [DEMO_ADS[0]],
  },
];

// ── Service functions ─────────────────────────────────────────
export async function fetchOffices(): Promise<Office[]> {
  return z.array(OfficeSchema).parse(DEMO_OFFICES);
}

export async function fetchOfficeById(id: string): Promise<Office | null> {
  const found = DEMO_OFFICES.find(o => o.id === id) ?? null;
  if (!found) return null;
  return OfficeSchema.parse(found);
}
