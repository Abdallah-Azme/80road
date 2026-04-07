'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useLogout } from '@/shared/hooks/useLogout';
import { useState } from 'react';

interface LogoutDialogProps {
  children?: React.ReactNode;
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            className="w-full h-12 rounded-xl text-destructive hover:bg-destructive/10 font-bold gap-2"
          >
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8 border-none shadow-2xl" dir="rtl">
        <DialogHeader className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <LogOut className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight">
            تسجيل الخروج
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-base">
            هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="destructive"
            className="flex-1 h-12 rounded-2xl font-black text-base shadow-lg shadow-destructive/20 active:scale-95 transition-all"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'نعم، تسجيل الخروج'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-black text-base border-2 hover:bg-muted active:scale-95 transition-all"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
