"use client";

import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";
import { useSettings } from "@/shared/hooks/useSettings";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSettings();

  const socialLinks = settings?.social_media;
  const description =
    settings?.site_description ||
    "المنصة العقارية الرائدة في الكويت. نسعى لتوفير أفضل تجربة بحث عن العقارات وتسهيل عملية البيع والشراء لعملائنا.";

  return (
    <footer
      className="w-full bg-card border-t border-border/60 pt-16 pb-32 md:pb-16"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
              {description}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.telegram && (
                <a
                  href={`https://t.me/${socialLinks.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {/* Fallback if no specific socials are provided */}
              {!socialLinks && (
                <>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest">
              روابط سريعة
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-bold text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-primary transition-colors"
                >
                  استكشف العقارات
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="hover:text-primary transition-colors"
                >
                  شركات العقارات
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="hover:text-primary transition-colors"
                >
                  حسابي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest">
              تواصل معنا
            </h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    الموقع
                  </span>
                  <span className="text-sm font-bold">
                    {settings?.site_address || "مدينة الكويت، شارع فهد السالم"}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    البريد الإلكتروني
                  </span>
                  <a
                    href={
                      settings?.site_email
                        ? `mailto:${settings.site_email}`
                        : "mailto:info@80road.com"
                    }
                    className="text-sm font-bold hover:text-primary transition-colors"
                  >
                    {settings?.site_email || "info@80road.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    دعم العملاء
                  </span>
                  <a
                    href={
                      settings?.site_phone
                        ? `tel:${settings.site_phone}`
                        : "tel:+9651808080"
                    }
                    className="text-sm font-bold hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    {settings?.site_phone || "+965 180 80 80"}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} {settings?.site_name || "80road"}. جميع الحقوق
            محفوظة.
          </p>
          <div className="flex items-center gap-8 text-xs font-bold text-muted-foreground">
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              الشروط والأحكام
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              الأسئلة الشائعة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
