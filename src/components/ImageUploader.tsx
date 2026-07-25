'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadImageToBucket } from '@/lib/supabase/storage';
import { isSupabaseConfigured } from '@/lib/supabase/data';

interface ImageUploaderProps {
  bucket: 'obras-imagenes' | 'artistas-imagenes';
  onImagesUploaded: (urls: string[]) => void;
  currentImages?: string[];
  multiple?: boolean;
  label?: string;
  className?: string;
}

export function ImageUploader({
  bucket,
  onImagesUploaded,
  currentImages = [],
  multiple = false,
  label = 'Subir Imagen',
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLive = isSupabaseConfigured();

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatusMessage('Procesando e imprimiendo imagen...');

    const newUrls: string[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) continue;

      let uploadedUrl: string | null = null;

      if (isLive) {
        uploadedUrl = await uploadImageToBucket(file, bucket);
      }

      // Si Supabase no está configurado o falla la subida a la nube, usar FileReader local
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        newUrls.push(uploadedUrl);
      }
    }

    setUploading(false);

    if (newUrls.length > 0) {
      const updatedList = multiple ? [...images, ...newUrls] : newUrls;
      setImages(updatedList);
      onImagesUploaded(updatedList);
      setStatusMessage(
        isLive
          ? '¡Imagen(es) subida(s) exitosamente a Supabase Storage!'
          : '¡Imagen lista (Modo Local/Previsualización)!'
      );
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    onImagesUploaded(updated);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-300 block">{label}</label>}

      {/* Zona de Drop & Click */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-white/15 bg-slate-900/60 hover:border-amber-500/40 hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center py-3 text-amber-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <span className="text-xs font-medium">Cargando imagen...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Haz clic para seleccionar o arrastra una imagen aquí
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Formatos soportados: JPG, PNG, WEBP, GIF (Máx. 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Mensaje de estado */}
      {statusMessage && (
        <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Previsualización de Imágenes Subidas */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-2">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                title="Eliminar imagen"
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
