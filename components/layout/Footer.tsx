'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, MessageCircle, Link2 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border/60 pt-16 pb-32 md:pb-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <div className="w-fit flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-black text-xl">80</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">80road</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
              المنصة العقارية الرائدة في الكويت. نسعى لتوفير أفضل تجربة بحث عن العقارات وتسهيل عملية البيع والشراء لعملائنا.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Link2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest">روابط سريعة</h3>
            <ul className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/explore" className="hover:text-primary transition-colors">استكشف العقارات</Link></li>
              <li><Link href="/companies" className="hover:text-primary transition-colors">شركات العقارات</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">حسابي</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest">التصنيفات</h3>
            <ul className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/explore?type=sale" className="hover:text-primary transition-colors">عقارات للبيع</Link></li>
              <li><Link href="/explore?type=rent" className="hover:text-primary transition-colors">عقارات للإيجار</Link></li>
              <li><Link href="/explore?type=commercial" className="hover:text-primary transition-colors">عقارات تجارية</Link></li>
              <li><Link href="/explore?type=land" className="hover:text-primary transition-colors">أراضي ومزارع</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest">تواصل معنا</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">الموقع</span>
                  <span className="text-sm font-bold">مدينة الكويت، شارع فهد السالم</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">البريد الإلكتروني</span>
                  <a href="mailto:info@80road.com" className="text-sm font-bold hover:text-primary transition-colors">info@80road.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">دعم العملاء</span>
                  <a href="tel:+9651808080" className="text-sm font-bold hover:text-primary transition-colors" dir="ltr">+965 180 80 80</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} 80road. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
