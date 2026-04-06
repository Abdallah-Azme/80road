'use client';

import * as React from 'react';
import { X, UploadCloud, Image as ImageIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomImage as Image } from '@/shared/components/custom-image';

interface MediaUploaderProps {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  className?: string;
}

export function MediaUploader({ value, onChange, accept = 'image/*', className }: MediaUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === 'string' && value.length > 0) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
  };

  const isVideo = value instanceof File 
    ? value.type.startsWith('video/') 
    : typeof value === 'string' && value.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div 
      className={cn(
        "relative rounded-2xl border-2 border-dashed border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors overflow-hidden flex items-center justify-center cursor-pointer group min-h-[160px]",
        className
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full h-full min-h-[160px]">
          {isVideo ? (
            <video src={preview} className="w-full h-full object-cover absolute inset-0" controls={false} />
          ) : (
            <Image src={preview} alt="preview" fill className="object-cover absolute inset-0" />
          )}
          {/* Overlay & Remove Button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-destructive/90 hover:bg-destructive text-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-all shadow-xl"
              aria-label="إزالة الملف"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground p-6 text-center">
          {accept.includes('video') && !accept.includes('image') ? (
            <Film className="w-10 h-10 opacity-30 mb-2" />
          ) : accept.includes('video') ? (
            <UploadCloud className="w-10 h-10 opacity-30 mb-2" />
          ) : (
            <ImageIcon className="w-10 h-10 opacity-30 mb-2" />
          )}
          <span className="text-sm font-bold">انقر لاختيار ملف</span>
          <span className="text-xs opacity-60 font-medium">يدعم {accept.includes('video') ? 'الصور والفيديوهات' : 'الصور'}</span>
        </div>
      )}
    </div>
  );
}
