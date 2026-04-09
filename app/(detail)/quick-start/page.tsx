'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, ChevronRight, MapPin, Globe, LayoutGrid, Save, User } from 'lucide-react';
import { useCountries, useStates, useCities } from '@/shared/hooks/useLocation';
import { useCategoriesAppearInFilter, useSaveFilterHistory } from '@/shared/hooks/useHome';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CustomImage } from '@/shared/components/custom-image';
import { useUIStore } from '@/stores/ui.store';
import { useUserStore } from '@/stores/user.store';

function QuickStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(1);
  
  // Selections
  const [userName, setUserName] = React.useState('');
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = React.useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = React.useState<number | null>(null);
  const [selectedCategoryValues, setSelectedCategoryValues] = React.useState<number[]>([]);

  // Data fetching
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: states, isLoading: loadingStates } = useStates(selectedCountryId || undefined);
  const { data: cities, isLoading: loadingCities } = useCities(selectedStateId || undefined);
  const { data: filters, isLoading: loadingFilters } = useCategoriesAppearInFilter();
  
  const saveFilterMutation = useSaveFilterHistory();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const toggleCategoryValue = (id: number) => {
    setSelectedCategoryValues((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const user = useUserStore((s) => s.user);
  const setPreferences = useUIStore((s) => s.setPreferences);
  const initialPrefs = useUIStore((s) => s.preferences);
  
  // Track if we've already tried to hydate from store to prevent loops
  const hasHydrated = React.useRef(false);

  React.useEffect(() => {
    // Only pre-fill if in edit mode and we haven't already hydrated this session
    if (searchParams.get('mode') === 'edit' && !hasHydrated.current) {
        // Pre-fill user name from store
        if (user?.name) setUserName(user.name);
        
        // Pre-fill choices from global preferences
        if (initialPrefs) {
            if (initialPrefs.countryId) setSelectedCountryId(initialPrefs.countryId);
            if (initialPrefs.stateId) setSelectedStateId(initialPrefs.stateId);
            if (initialPrefs.cityId) setSelectedCityId(initialPrefs.cityId);
            if (initialPrefs.categoryValues) setSelectedCategoryValues(initialPrefs.categoryValues);
            
            // Start at step 2 (locations) since we usually have name/id
            setStep(2); 
        }
        hasHydrated.current = true;
    }
  }, [initialPrefs, searchParams, user]);

  const onFinalSubmit = () => {
    if (!selectedStateId || !selectedCityId) {
      toast.error('يرجى اختيار المنطقة والمدينة');
      return;
    }

    // Capture human-readable names to save into local preference store
    const stateName = states?.find(s => s.id === selectedStateId)?.name || '';
    const cityName = cities?.find(c => c.id === selectedCityId)?.name || '';
    
    // For propertyType, let's take the first category value name that looks like a property type, 
    // or just the first selected one if it exists.
    let propertyTypeName = '';
    if (selectedCategoryValues.length > 0) {
       for(const group of filters || []) {
           const match = group.values.find(v => selectedCategoryValues.includes(v.id));
           if (match) {
               propertyTypeName = match.value;
               break;
           }
       }
    }

    // Save to local storage via Zustand for immediate UI feedback (like on Home page).
    // This is the source of truth — the API call below is best-effort only.
    setPreferences({
      propertyType: propertyTypeName,
      area: cityName || stateName,
      purpose: 'للإيجار',
      countryId: selectedCountryId || undefined,
      stateId: selectedStateId || undefined,
      cityId: selectedCityId || undefined,
      categoryValues: selectedCategoryValues,
    });

    // Navigate immediately — preferences are already persisted locally.
    // The API save runs in the background as a best-effort operation.
    // We do NOT wait for it so that a 401 (or any API error) can never
    // wipe the auth cookie and redirect the user back to the login page.
    router.push('/');

    saveFilterMutation.mutate({
      state_id: selectedStateId,
      city_id: selectedCityId,
      category_values_ids: selectedCategoryValues,
      name: userName,
    });
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto shadow-inner shadow-primary/5">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">مرحباً بك! ما هو اسمك؟</h2>
            </div>
            <div className="relative group">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="أدخل اسمك هنا..."
                className="h-16 rounded-2xl border-2 text-xl font-black text-center focus:ring-8 focus:ring-primary/5 transition-all"
                autoFocus
              />
            </div>
            <Button 
                className="w-full h-15 rounded-2xl font-black text-lg gap-2 mt-4"
                onClick={handleNext}
                disabled={!userName.trim()}
            >
                التالي <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-border/40">
              {loadingCountries ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
                ))
              ) : (
                countries?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCountryId(c.id); handleNext(); }}
                    className={cn(
                      "p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden",
                      selectedCountryId === c.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <CustomImage 
                      src={c.image} 
                      alt={c.name} 
                      width={48} 
                      height={48} 
                      className="object-contain group-hover:scale-110 transition-transform" 
                    />
                    <span className="font-black text-sm text-center">{c.name}</span>
                    {selectedCountryId === c.id && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />}
                  </button>
                ))
              )}
            </div>
            {selectedCountryId && (
              <Button 
                className="w-full h-15 rounded-2xl font-black text-lg gap-2 mt-2 group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={handleNext}
              >
                المتابعة <ChevronRight className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/40">
              {loadingStates ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
                ))
              ) : (
                states?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStateId(s.id); handleNext(); }}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center font-bold",
                      selectedStateId === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    {s.name}
                  </button>
                ))
              )}
            </div>
            {selectedStateId && (
              <Button 
                className="w-full h-15 rounded-2xl font-black text-lg gap-2 mt-2 group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={handleNext}
              >
                المتابعة <ChevronRight className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/40">
              {loadingCities ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-14 rounded-2xl bg-muted animate-pulse" />
                ))
              ) : (
                cities?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCityId(c.id); handleNext(); }}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all text-center font-bold",
                      selectedCityId === c.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    {c.name}
                  </button>
                ))
              )}
            </div>
            {selectedCityId && (
              <Button 
                className="w-full h-15 rounded-2xl font-black text-lg gap-2 mt-2 group shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                onClick={handleNext}
              >
                المتابعة <ChevronRight className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loadingFilters ? (
              <div className="space-y-6">
                {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                       {Array(3).fill(0).map((_, j) => <div key={j} className="h-10 w-20 bg-muted rounded-full animate-pulse" />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              filters?.map((group) => (
                <div key={group.id} className="space-y-4">
                  <h3 className="font-black text-foreground flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    {group.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {group.values.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => toggleCategoryValue(v.id)}
                        className={cn(
                          "px-6 py-2 rounded-full border-2 transition-all font-bold text-sm",
                          selectedCategoryValues.includes(v.id) 
                            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
            <div className="pt-4">
                <Button 
                    className="w-full h-15 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                    onClick={onFinalSubmit}
                    disabled={saveFilterMutation.isPending}
                >
                    {saveFilterMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    حفظ وإكمال التصفح
                </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const stepsInfo = [
    { title: 'الاسم', icon: User },
    { title: 'الدولة', icon: Globe },
    { title: 'المنطقة', icon: MapPin },
    { title: 'المدينة', icon: CheckCircle2 },
    { title: 'التفضيلات', icon: LayoutGrid },
  ];

  return (
    <div className="container max-w-2xl mx-auto px-6 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">الإعداد السريع</h1>
        <p className="text-muted-foreground font-medium text-lg italic">لنقم بتخصيص تجربتك في دقائق</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-between relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
        <div 
           className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 rounded-full" 
           style={{ width: `${((step - 1) / (stepsInfo.length - 1)) * 100}%` }}
        />
        {stepsInfo.map((s, i) => {
          const Icon = s.icon;
          const active = step >= i+1;
          const current = step === i+1;
          return (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                 className={cn(
                   "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                   active ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground",
                   current && "ring-4 ring-primary/20 scale-110 shadow-lg shadow-primary/20"
                 )}
              >
                {active && step > i+1 ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={cn("text-[10px] font-black transition-colors uppercase tracking-tight", active ? "text-foreground" : "text-muted-foreground")}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <Card className="border-border/60 shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden bg-card/60 backdrop-blur-xl border-t-8 border-t-primary relative">
        <CardHeader className="pb-2">
           <CardTitle className="text-2xl font-black flex items-center gap-2">
             {stepsInfo[step-1].title}
             {step > 1 && (
               <button onClick={handleBack} className="ms-auto flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                 <ChevronRight className="w-4 h-4" /> العودة
               </button>
             )}
           </CardTitle>
           <CardDescription className="text-base font-medium">خطوة {step} من {stepsInfo.length}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>

    </div>
  );
}

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-12 pt-8 md:pt-16" dir="rtl">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" /></div>}>
        <QuickStartContent />
      </Suspense>
    </div>
  );
}
