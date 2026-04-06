'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateProfileSchema, UpdateProfileInput } from '../schemas/profile.schema';
import { useProfile } from '../hooks/useProfile';
import { ProfileData } from '../services/profile.service';

interface UpdateProfileDialogProps {
  children: React.ReactNode;
  profileData?: ProfileData;
}

export function UpdateProfileDialog({ children, profileData }: UpdateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateProfile, isUpdating } = useProfile();
  
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profileData?.name || '',
      caption: profileData?.caption || '',
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.caption) formData.append('caption', data.caption);
      
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      await updateProfile(formData);
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تحديث الملف الشخصي</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف (Caption)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>الصورة الشخصية</FormLabel>
              <FormControl>
                <Input id="image-upload" type="file" accept="image/*" />
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
