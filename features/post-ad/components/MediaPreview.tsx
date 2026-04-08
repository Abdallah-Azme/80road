'use client';

import { X, Upload, Play } from 'lucide-react';
import { CustomImage as Image } from '@/shared/components/custom-image';
import { useRef } from 'react';

// ── ImagePreviewCard ────────────────────────────────────────────────────────

interface ImagePreviewCardProps {
  file: string | File;
  index: number;
  onRemove: (index: number) => void;
}

export function ImagePreviewCard({ file, index, onRemove }: ImagePreviewCardProps) {
  const src = typeof file === 'string' ? file : URL.createObjectURL(file);

  return (
    <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative shadow-sm border border-border group">
      <Image
        src={src}
        fill
        className="w-full h-full object-cover"
        alt={`صورة ${index + 1}`}
        unoptimized
      />
      {/* Delete button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        aria-label={`حذف الصورة ${index + 1}`}
        className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/70 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-90 shadow-lg"
      >
        <X className="w-4 h-4 stroke-[3px]" />
      </button>
    </div>
  );
}

// ── ImageUploadGrid ─────────────────────────────────────────────────────────

interface ImageUploadGridProps {
  images: (string | File)[];
  onChange: (images: (string | File)[]) => void;
}

export function ImageUploadGrid({ images, onChange }: ImageUploadGridProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange([...images, ...Array.from(e.target.files)]);
      // Reset input so same files can be re-added if removed
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
      {/* Upload trigger */}
      <div className="aspect-square bg-primary/5 rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center relative active:bg-primary/10 transition-colors group cursor-pointer">
        <Upload className="w-10 h-10 text-primary mb-3 group-hover:-translate-y-1 transition-transform" />
        <span className="text-sm font-black text-primary">رفع الصور</span>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          aria-label="رفع صور"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFilesAdded}
        />
      </div>

      {/* Uploaded images */}
      {images.map((file, i) => (
        <ImagePreviewCard key={`img-${i}`} file={file} index={i} onRemove={handleRemove} />
      ))}
    </div>
  );
}

// ── VideoUploadPreview ──────────────────────────────────────────────────────

interface VideoUploadPreviewProps {
  video: string | File | null | undefined;
  onChange: (video: File | null) => void;
}

export function VideoUploadPreview({ video, onChange }: VideoUploadPreviewProps) {
  const videoRef = useRef<HTMLInputElement>(null);
  const videoSrc = video
    ? typeof video === 'string'
      ? video
      : URL.createObjectURL(video)
    : null;

  const handleRemove = () => {
    onChange(null);
    if (videoRef.current) videoRef.current.value = '';
  };

  return (
    <div className="relative aspect-video bg-muted/50 rounded-3xl overflow-hidden border-2 border-dashed border-border mb-4 flex items-center justify-center hover:bg-muted transition-colors group">
      {videoSrc ? (
        <>
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            controls
          />
          {/* Delete button */}
          <button
            type="button"
            onClick={handleRemove}
            aria-label="حذف الفيديو"
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/70 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
          >
            <X className="w-4 h-4 stroke-[3px]" />
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-foreground">اضغط لرفع فيديو</span>
              <span className="text-sm text-muted-foreground mt-1">اختياري، للفيديوهات القصيرة</span>
            </div>
          </div>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            aria-label="رفع فيديو"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files?.[0]) onChange(e.target.files[0]);
            }}
          />
        </>
      )}
    </div>
  );
}
