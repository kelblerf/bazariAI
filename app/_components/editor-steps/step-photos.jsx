"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Loader2, MoveDown, MoveUp, Star, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { uploadsApi } from '../../_lib/client-api';

export default function StepPhotos({ photos, onPhotosChange }) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const fileRef = useRef();

  const handleFiles = async (files) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const newUrls = [];
      for (const file of Array.from(files)) {
        const { file_url } = await uploadsApi.upload(file);
        newUrls.push(file_url);
      }
      onPhotosChange([...photos, ...newUrls]);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (idx) => {
    const targetUrl = photos[idx];
    setDeletingIndex(idx);
    try {
      await uploadsApi.remove(targetUrl);
    } catch {
      // Keep UX forgiving for older local/data URLs or already-missing files.
    } finally {
      onPhotosChange(photos.filter((_, i) => i !== idx));
      setDeletingIndex(null);
    }
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const arr = [...photos];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onPhotosChange(arr);
  };

  const moveDown = (idx) => {
    if (idx === photos.length - 1) return;
    const arr = [...photos];
    [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    onPhotosChange(arr);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Fotografie produktu</h2>
        <p className="text-sm text-muted-foreground">
          Nahrajte co nejv\u00edce fotek - p\u0159edn\u00ed stranu, zadn\u00ed stranu, detaily, p\u0159\u00edpadn\u00e1 po\u0161kozen\u00ed, p\u0159\u00edslu\u0161enstv\u00ed a \u0161t\u00edtek se s\u00e9riov\u00fdm \u010d\u00edslem.
          Prvn\u00ed fotografie bude tituln\u00ed.
        </p>
      </div>

      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-150',
          'hover:border-primary/50 hover:bg-primary/5 border-border bg-muted/30'
        )}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Nahr\u00e1v\u00e1m fotografie...</span>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Klikn\u011bte nebo p\u0159et\u00e1hn\u011bte fotografie</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP - v\u00edce soubor\u016f najednou</p>
          </>
        )}
      </div>

      {photos.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {photos.length} {photos.length === 1 ? 'fotografie' : photos.length < 5 ? 'fotografie' : 'fotografi\u00ed'} \u00b7 P\u0159et\u00e1hn\u011bte nebo pou\u017eijte \u0161ipky pro zm\u011bnu po\u0159ad\u00ed
          </p>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((url, idx) => (
              <div key={url + idx} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-muted">
                <Image
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white transition-colors"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === photos.length - 1}
                    className="p-1.5 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white transition-colors"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(idx)}
                    className="p-1.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                  >
                    {deletingIndex === idx ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  </button>
                </div>

                <div
                  className={cn(
                    'absolute top-2 left-2 rounded-md text-xs font-bold px-1.5 py-0.5',
                    idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-black/50 text-white'
                  )}
                >
                  {idx === 0 ? (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" /> Tituln\u00ed
                    </span>
                  ) : (
                    `#${idx + 1}`
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length > 0 && photos.length < 3 && (
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 text-sm text-warning">
          <strong>Tip:</strong> Inzer\u00e1ty s v\u00edce fotografiemi maj\u00ed v\u00fdrazn\u011b vy\u0161\u0161\u00ed \u0161anci na prodej. Doporu\u010dujeme alespo\u0148 4-6 fotek.
        </div>
      )}
    </div>
  );
}
