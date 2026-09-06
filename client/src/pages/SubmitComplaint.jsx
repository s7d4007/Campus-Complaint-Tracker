import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

const CATEGORIES = ['infrastructure', 'hostel', 'academics', 'canteen', 'transport', 'safety', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function SubmitComplaint() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'medium' });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return toast.error('Please select a category.');
        setLoading(true);
        try {
            const { data } = await api.post('/api/complaints', { ...form, image_urls: images });
            toast.success('Complaint submitted successfully!');
            navigate(`/complaints/${data.complaint.id}`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Submit a Complaint</h1>
                <p className="text-gray-400 mt-1">Fill in the details below. Be as specific as possible.</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="label">Title *</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Brief summary of the issue"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required maxLength={120}
                        />
                    </div>

                    {/* Category & Priority row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Category *</label>
                            <select
                                className="input capitalize"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                required
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Priority *</label>
                            <select
                                className="input capitalize"
                                value={form.priority}
                                onChange={e => setForm({ ...form, priority: e.target.value })}
                            >
                                {PRIORITIES.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description *</label>
                        <textarea
                            className="input resize-none"
                            rows={5}
                            placeholder="Describe the issue in detail — location, time observed, impact, etc."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            required minLength={20}
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="label">Attachments (optional)</label>
                        <ImageUploader onUpload={setImages} />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        <FiSend size={16} />
                        {loading ? 'Submitting…' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </div>
    );
}
