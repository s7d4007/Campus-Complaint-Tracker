import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) return toast.error('Passwords do not match.');
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/register', {
                name: form.name, email: form.email, password: form.password,
            });
            login(data.user, data.token);
            toast.success('Account created! Welcome 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const field = (key, type, label, placeholder, Icon) => (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type={type}
                    className="input pl-10"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    required
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary-600/50">CC</div>
                    <h1 className="text-2xl font-bold text-white">Create account</h1>
                    <p className="text-gray-400 mt-1">Join Campus Complaint Tracker</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {field('name', 'text', 'Full Name', 'Your full name', FiUser)}
                        {field('email', 'email', 'Email', 'you@university.edu', FiMail)}
                        {field('password', 'password', 'Password', 'Min. 6 characters', FiLock)}
                        {field('confirm', 'password', 'Confirm Password', '••••••••', FiLock)}
                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            <FiUserPlus size={16} />
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
