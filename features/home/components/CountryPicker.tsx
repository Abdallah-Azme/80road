'use client';

import { useState } from 'react';
import { useUIStore } from '@/stores/ui.store';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'TR', name: 'تركيا', flag: '🇹🇷' },
];

export function CountryPicker() {
  const [open, setOpen] = useState(false);
  const { selectedCountryCode, setSelectedCountry } = useUIStore();

  const current = COUNTRIES.find(c => c.code === selectedCountryCode) ?? COUNTRIES[0];

  const handleSelect = (code: string) => {
    setSelectedCountry(code);
    setOpen(false);
    // Soft-lock: demo only allows Kuwait
    if (code !== 'KW') {
      setTimeout(() => setSelectedCountry('KW'), 800);
    }
  };

  return (
    <>
      <div className="flex flex-col" dir="rtl">
        <span className="text-xs text-muted-foreground font-bold mb-0.5">الدولة</span>
        <Button
          id="country-picker-btn"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full px-3 h-8 border-border shadow-sm"
        >
          <span className="text-lg leading-none">{current.flag}</span>
          <span className="text-sm font-bold">{current.name}</span>
          <ChevronDown className="w-3 h-3 text-primary" />
        </Button>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent dir="rtl">
          <DrawerHeader className="text-center">
            <DrawerTitle>اختر الدولة</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4 pb-8 overflow-y-auto max-h-[60vh]">
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                id={`country-option-${c.code}`}
                onClick={() => handleSelect(c.code)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                  current.code === c.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-bold text-foreground">{c.name}</span>
                </div>
                {current.code === c.code && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
