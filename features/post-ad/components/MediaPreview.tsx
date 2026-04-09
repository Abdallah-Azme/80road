'use client';

import { X, Upload, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { CustomImage as Image } from '@/shared/components/custom-image';
import { useRef } from 'react';
import type { ChunkedUploadStatus } from '../hooks/useChunkedVideoUpload';

// ── ImagePreviewCard ────────────────────────────────────────────────────────

interface ImagePreviewCardProps {
  file: string | File;
  index: number;
  onRemove: (index: number) => void;
}

export function ImagePreviewCard({ file, index, onRemove }: ImagePreviewCardProps) {
  // Guard: only call createObjectURL when we have a real File/Blob
  const src: string | null =
    typeof file === 'string'
      ? file
      : file instanceof Blob
        ? URL.createObjectURL(file)
        : null;

  if (!src) return null;

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

  // Only render entries that are a real string URL or a File/Blob — drop stale store values
  const validImages = images.filter(
    (f): f is string | File => typeof f === 'string' || f instanceof Blob,
  );

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

      {/* Uploaded images — only valid File/Blob or string-URL entries */}
      {validImages.map((file, i) => (
        <ImagePreviewCard key={`img-${i}`} file={file} index={i} onRemove={handleRemove} />
      ))}
    </div>
  );
}

// ── VideoUploadPreview ──────────────────────────────────────────────────────

interface VideoUploadPreviewProps {
  /** The local File chosen by the user — used for preview only */
  file: File | null | undefined;
  /** Upload status driven by useChunkedVideoUpload */
  uploadStatus: ChunkedUploadStatus;
  /** 0-100 */
  uploadProgress: number;
  /** Server-side path after merge — shown when done */
  serverPath: string | null;
  /** Error message if status === 'error' */
  uploadError: string | null;
  /** Called when the user picks a new file */
  onFileChange: (file: File) => void;
  /** Called when the user removes the current video */
  onRemove: () => void;
}

export function VideoUploadPreview({
  file,
  uploadStatus,
  uploadProgress,
  serverPath,
  uploadError,
  onFileChange,
  onRemove,
}: VideoUploadPreviewProps) {
  const videoRef = useRef<HTMLInputElement>(null);
  const localSrc = file instanceof Blob ? URL.createObjectURL(file) : null;

  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'merging';
  const isDone = uploadStatus === 'done';
  const isError = uploadStatus === 'error';

  const handleRemove = () => {
    onRemove();
    if (videoRef.current) videoRef.current.value = '';
  };

  return (
    <div className="relative aspect-video bg-muted/50 rounded-3xl overflow-hidden border-2 border-dashed border-border mb-4 flex items-center justify-center hover:bg-muted transition-colors group">
      {/* ── Local preview with overlay states ── */}
      {localSrc ? (
        <>
          <video
            src={localSrc}
            className="w-full h-full object-cover"
            controls={isDone}
            muted
          />

          {/* Uploading / merging overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 z-10">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <span className="text-white font-bold text-base">
                {uploadStatus === 'merging' ? 'جاري دمج الأجزاء...' : `جاري الرفع... ${uploadProgress}%`}
              </span>
              {/* Progress bar */}
              <div className="w-3/4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error overlay */}
          {isError && (
            <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-3 z-10">
              <AlertCircle className="w-10 h-10 text-red-300" />
              <span className="text-white font-bold text-sm text-center px-4">{uploadError}</span>
              <button
                type="button"
                onClick={handleRemove}
                className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Done overlay (brief flash of green before controls show) */}
          {isDone && serverPath && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-green-500/90 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
              <CheckCircle className="w-4 h-4" />
              تم الرفع بنجاح
            </div>
          )}

          {/* Delete button — always visible unless uploading */}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="حذف الفيديو"
              className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/70 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
            >
              <X className="w-4 h-4 stroke-[3px]" />
            </button>
          )}
        </>
      ) : (
        /* ── Empty state — no file selected ── */
        <>
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-foreground">اضغط لرفع فيديو</span>
              <span className="text-sm text-muted-foreground mt-1">
                اختياري — سيتم رفعه تلقائياً بالأجزاء
              </span>
            </div>
          </div>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            aria-label="رفع فيديو"
            id="video-upload-input"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileChange(e.target.files[0]);
            }}
          />
        </>
      )}
    </div>
  );
}
