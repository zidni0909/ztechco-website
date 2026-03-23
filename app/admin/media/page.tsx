'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Download } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';

interface MediaFile {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  created_at: string;
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const itemsPerPage = 20;

  useEffect(() => {
    fetchFiles();
  }, [currentPage]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();
      setFiles(data.files || []);
      setTotalItems(data.total || 0);
      setError('');
    } catch (err) {
      setError('Failed to load media files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = async (selectedFiles: File[] | FileList) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      setUploadingFile(true);
      setError('');

      for (const file of Object.values(selectedFiles)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to upload file');
        }
      }

      setSuccess('File(s) uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles(files.filter(f => f.id !== id));
        setTotalItems(totalItems - 1);
        setSuccess('File deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete file');
      }
    } catch (err) {
      setError('Failed to delete file');
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files);
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Upload and manage your media files</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mb-8 p-8 border-2 border-dashed rounded-xl transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <Upload size={32} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your files here</h3>
            <p className="text-gray-600 mb-4">or click to browse from your computer</p>
            <input
              type="file"
              id="file-input"
              multiple
              onChange={(e) => handleFileSelected(e.target.files!)}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* Files Grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading media files...</div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No media files yet. Upload one to get started!</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                {files.map((file) => (
                  <div key={file.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {isImage(file.mime_type) ? (
                      <div className="aspect-square bg-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={file.file_path}
                          alt={file.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl mb-2">📄</div>
                          <p className="text-xs text-gray-600 px-2 truncate">{file.filename}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-white border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 text-sm truncate mb-2 title" title={file.filename}>
                        {file.filename}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">{formatFileSize(file.file_size)}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(file.file_path)}
                          className="flex-1 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <Copy size={14} />
                        </button>
                        <a
                          href={file.file_path}
                          download
                          className="flex-1 px-3 py-2 text-xs text-green-600 hover:bg-green-50 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="flex-1 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
