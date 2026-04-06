'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useCountries } from '../hooks/useCountries';
import { Country } from '../types/country';
import { CustomImage } from './custom-image';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (countryId: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

export function PhoneInput({
  value = '',
  onChange,
  onCountryChange,
  placeholder,
  className,
  disabled,
  defaultCountry = 'KW',
}: PhoneInputProps) {
  const { data: countries, isLoading } = useCountries();
  const [open, setOpen] = React.useState(false);
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);

  // Initialize selected country from default or initial value
  React.useEffect(() => {
    if (countries && !selectedCountryId) {
       if (value) {
         const country = countries.find(c => {
           const clean = c.phone_code.replace('+', '');
           return value.startsWith(`+${clean}`);
         });
         if (country) {
           setSelectedCountryId(country.id);
           onCountryChange?.(country.id);
           return;
         }
       }
       
       // Fallback to defaultCountry
       const defaultC = countries.find(c => c.country_code === defaultCountry) || countries[0];
       if (defaultC) {
         setSelectedCountryId(defaultC.id);
         onCountryChange?.(defaultC.id);
       }
    }
  }, [countries, selectedCountryId, defaultCountry, value, onCountryChange]);

  const selectedCountry = React.useMemo(() => {
    return countries?.find(c => c.id === selectedCountryId) || null;
  }, [countries, selectedCountryId]);

  const cleanPhoneCode = React.useMemo(() => {
    return selectedCountry?.phone_code?.replace('+', '') || '';
  }, [selectedCountry]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountryId(country.id);
    onCountryChange?.(country.id);
    setOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    onChange?.(input);
  };

  const displayValue = value.replace(/\D/g, ''); // Ensure only digits are displayed

  return (
    <div className={cn('flex gap-0 w-full', className)} dir="ltr">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[80px] rounded-l-2xl rounded-r-none border-r-0 px-3 h-full font-black focus:z-10"
            disabled={disabled || isLoading}
          >
            {selectedCountry ? (
               <div className="flex items-center gap-1">
                 <div className="relative w-6 h-4 overflow-hidden rounded-sm bg-muted shrink-0">
                    <CustomImage
                      src={selectedCountry.image}
                      alt={selectedCountry.name}
                      fill
                      className="object-cover"
                    />
                 </div>
                 <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
               </div>
            ) : isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="ابحث عن دولة..." className="text-right" dir="rtl" />
            <CommandList>
              <ScrollArea className="h-72">
                <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
                <CommandGroup>
                  {countries?.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={`${country.name} ${country.phone_code} ${country.country_code}`}
                      onSelect={() => handleCountrySelect(country)}
                      className="gap-2 flex-row-reverse text-right"
                    >
                      <div className="relative w-6 h-4 overflow-hidden rounded-sm bg-muted shrink-0">
                        <CustomImage
                          src={country.image}
                          alt={country.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="flex-1 text-sm font-black">{country.name}</span>
                       <span className="text-xs text-muted-foreground font-black" dir="ltr">
                        +{country.phone_code.replace('+', '')}
                      </span>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedCountry?.id === country.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="relative flex-1 h-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-black text-sm z-10" dir="ltr">
          +{cleanPhoneCode}
        </div>
        <Input
          type="tel"
          placeholder={placeholder}
          value={displayValue}
          onChange={handlePhoneChange}
          disabled={disabled}
          className="rounded-r-2xl rounded-l-none h-full pl-12 font-black border-l-0 text-left"
          dir="ltr"
        />
      </div>
    </div>
  );
}
