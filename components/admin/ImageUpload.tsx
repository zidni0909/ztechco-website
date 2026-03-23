'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedSize?: string;
  maxSizeMB?: number;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  recommendedSize = '1200 x 630 px',
  maxSizeMB = 2,
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleUpload = async (file: File) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP)');
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB. File ini ${(file.size / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload gagal');
      }

      const data = await res.json();
      onChange(data.path);
    } catch (err: any) {
      setError(err.message || 'Upload gagal. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  const acceptFormats = accept.split(',').map(t => t.replace('image/', '').toUpperCase()).join(', ');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 shadow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 truncate border-t">
            {value}
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
            ${dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-600">Mengupload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Klik untuk upload atau drag & drop
              </p>
              <p className="text-xs text-gray-500">
                {acceptFormats} &bull; Maks {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Info & Error */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          Rekomendasi ukuran: {recommendedSize}
        </p>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
