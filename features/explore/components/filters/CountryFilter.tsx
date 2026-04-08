'use client';

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type ExploreFilterValues } from "../../schemas/filter.schema";
import { useCountries } from "@/shared/hooks/useCountries";
import Image from "next/image";
import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

interface CountryFilterProps {
  form: UseFormReturn<ExploreFilterValues>;
}

export function CountryFilter({ form }: CountryFilterProps) {
  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const [searchValue, setSearchValue] = React.useState("");

  const countryId = form.watch("country_id");

  const filteredCountries = React.useMemo(() => {
    if (!countries) return [];
    if (!searchValue) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [countries, searchValue]);

  const selectedCountry = React.useMemo(() => 
    countries?.find(
        (c) => String(c.id) === String(countryId)
    ), [countries, countryId]);

  return (
    <FormField
      control={form.control}
      name="country_id"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">الدولة</FormLabel>
          <FormControl>
            <Combobox
              value={selectedCountry?.name ?? null}
              onValueChange={(val) => {
                const selected = countries?.find((c) => c.name === val);
                field.onChange(selected ? selected.id : "");
                setSearchValue(""); // Clear search on selection
              }}
              onInputValueChange={setSearchValue}
            >
              <div className="relative group">
                <ComboboxInput
                    placeholder={selectedCountry?.name || "اختر الدولة..."}
                    className="w-full h-12 rounded-2xl border-border/60 font-bold pr-11"
                    showClear
                />
                {selectedCountry?.image && !searchValue && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Image
                            src={selectedCountry.image}
                            alt={selectedCountry.name}
                            width={20}
                            height={15}
                            className="rounded-sm object-cover"
                        />
                    </div>
                )}
              </div>
              <ComboboxContent align="start" className="w-[--anchor-width] rounded-2xl border-border/60 shadow-2xl">
                <ComboboxList className="p-2 space-y-1">
                  {isLoadingCountries ? (
                    <div className="p-8 text-center">
                        <span className="text-sm font-bold text-muted-foreground animate-pulse">جاري التحميل...</span>
                    </div>
                  ) : filteredCountries.length === 0 ? (
                    <ComboboxEmpty className="p-8 text-center text-sm font-bold text-muted-foreground">
                        لا يوجد نتائج لـ &quot;{searchValue}&quot;
                    </ComboboxEmpty>
                  ) : (
                    filteredCountries.map((c) => (
                      <ComboboxItem 
                        key={c.id} 
                        value={c.name}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all data-highlighted:bg-primary/10 data-highlighted:text-primary"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {c.image && (
                            <Image
                              src={c.image}
                              alt={c.name}
                              width={24}
                              height={18}
                              className="rounded-sm object-cover shadow-sm"
                            />
                          )}
                          <span className="font-bold">{c.name}</span>
                        </div>
                      </ComboboxItem>
                    ))
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
