import { useState, useRef } from 'react';
import api from '../api/axios';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ImageUploader({ onUpload }) {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef();

    const handleFiles = async (files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!validFiles.length) return toast.error('Please select image files only.');
        if (previews.length + validFiles.length > 4) return toast.error('Maximum 4 images allowed.');

        setUploading(true);
        const uploadedUrls = [];

        for (const file of validFiles) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const { data } = await api.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploadedUrls.push({ url: data.url, path: data.path });
                setPreviews(prev => [...prev, { url: data.url, path: data.path, name: file.name }]);
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setUploading(false);
        if (uploadedUrls.length) onUpload(uploadedUrls.map(u => u.url));
    };

    const remove = (idx) => {
        const updated = previews.filter((_, i) => i !== idx);
        setPreviews(updated);
        onUpload(updated.map(p => p.url));
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
                className="border-2 border-dashed border-gray-700 hover:border-primary-500 rounded-xl p-6 text-center cursor-pointer transition-colors group"
            >
                <FiUploadCloud size={28} className="mx-auto mb-2 text-gray-500 group-hover:text-primary-400 transition-colors" />
                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                    {uploading ? 'Uploading…' : 'Click or drag images here (max 4, 5MB each)'}
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {previews.map((p, i) => (
                        <div key={i} className="relative group/img">
                            <img src={p.url} alt={p.name} className="h-20 w-full object-cover rounded-lg border border-gray-700" />
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                                <FiX size={10} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
