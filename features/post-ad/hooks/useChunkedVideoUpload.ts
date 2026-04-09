'use client';

import { useState, useCallback } from 'react';
// Use built-in crypto.randomUUID — available in modern browsers and Node 14.17+
import { postAdService } from '../services/post-ad.service';

/** Size of each chunk in bytes (2 MB) */
const CHUNK_SIZE = 2 * 1024 * 1024;

export type ChunkedUploadStatus =
  | 'idle'
  | 'uploading'
  | 'merging'
  | 'done'
  | 'error';

export interface VideoUploadState {
  /** The local File selected by the user */
  file: File;
  /** Progress: 0-100 */
  progress: number;
  status: ChunkedUploadStatus;
  /** Server-side path returned after merging — use this in createAd */
  serverPath: string | null;
  error: string | null;
}

export function useChunkedVideoUpload() {
  const [uploadState, setUploadState] = useState<VideoUploadState | null>(null);

  const reset = useCallback(() => {
    setUploadState(null);
  }, []);

  /**
   * Start chunked upload for a video file.
   * Returns the merged server path on success, or throws on failure.
   */
  const uploadVideo = useCallback(async (file: File): Promise<string> => {
    const fileId = crypto.randomUUID();
    const extension = '.' + (file.name.split('.').pop() ?? 'mp4');
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    setUploadState({
      file,
      progress: 0,
      status: 'uploading',
      serverPath: null,
      error: null,
    });

    try {
      // Upload all chunks sequentially to avoid overwhelming the server
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        await postAdService.uploadChunk({
          fileId,
          chunkIndex: i,
          chunk,
        });

        const progress = Math.round(((i + 1) / totalChunks) * 90); // 0–90% during upload
        setUploadState((prev) =>
          prev ? { ...prev, progress } : prev,
        );
      }

      // Merge all chunks → get server path
      setUploadState((prev) =>
        prev ? { ...prev, status: 'merging', progress: 95 } : prev,
      );

      const mergeRes = await postAdService.mergeChunks({
        fileId,
        totalChunks,
        originalExtension: extension,
      });

      if (!mergeRes.status) {
        throw new Error(mergeRes.message || 'Failed to merge video chunks');
      }

      const serverPath = mergeRes.data.path;

      setUploadState((prev) =>
        prev
          ? { ...prev, status: 'done', progress: 100, serverPath }
          : prev,
      );

      return serverPath;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الفيديو';
      setUploadState((prev) =>
        prev ? { ...prev, status: 'error', error: message } : prev,
      );
      throw err;
    }
  }, []);

  return { uploadState, uploadVideo, reset };
}
