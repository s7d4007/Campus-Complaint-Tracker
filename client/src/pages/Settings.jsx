import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
    FiUser, FiMail, FiEdit2, FiCheck, FiX,
    FiSun, FiMoon, FiMonitor, FiShield, FiSave
} from 'react-icons/fi';

const THEME_OPTIONS = [
    { value: 'system', label: 'System', Icon: FiMonitor },
    { value: 'light', label: 'Light', Icon: FiSun },
    { value: 'dark', label: 'Dark', Icon: FiMoon },
];

export default function Settings() {
    const { user, updateUser } = useAuth();
    const { theme, setTheme } = useTheme();

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [savingName, setSavingName] = useState(false);

    const handleSaveName = async () => {
        if (!name.trim()) return toast.error('Name cannot be empty.');
        if (name.trim() === user.name) { setEditingName(false); return; }
        setSavingName(true);
        try {
            const { data } = await api.patch('/api/auth/profile', { name: name.trim() });
            updateUser(data.user);
            setEditingName(false);
            toast.success('Name updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to update name.');
        } finally {
            setSavingName(false);
        }
    };

    const handleCancelEdit = () => {
        setName(user?.name || '');
        setEditingName(false);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

            {/* Page header */}
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1 text-sm">Manage your profile and preferences.</p>
            </div>

            {/* ── Profile card ─────────────────────────── */}
            <div className="card space-y-5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center">
                        <FiUser size={18} className="text-primary-400" />
                    </div>
                    <h2 className="font-semibold text-white">Profile Information</h2>
                </div>

                {/* Display Name */}
                <div>
                    <label className="label">Display Name</label>
                    {editingName ? (
                        <div className="flex gap-2 mt-1">
                            <input
                                id="settings-name-input"
                                type="text"
                                className="input flex-1"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleSaveName();
                                    if (e.key === 'Escape') handleCancelEdit();
                                }}
                                autoFocus
                                maxLength={64}
                            />
                            <button
                                id="settings-save-name"
                                onClick={handleSaveName}
                                disabled={savingName}
                                className="btn-primary flex items-center gap-1.5 px-4 py-2.5 text-sm"
                            >
                                {savingName
                                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    : <FiSave size={15} />
                                }
                                Save
                            </button>
                            <button
                                id="settings-cancel-name"
                                onClick={handleCancelEdit}
                                className="btn-secondary flex items-center gap-1.5 px-4 py-2.5 text-sm"
                            >
                                <FiX size={15} /> Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mt-1">
                            <div className="input flex-1 cursor-default select-none flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <span>{user?.name}</span>
                            </div>
                            <button
                                id="settings-edit-name"
                                onClick={() => setEditingName(true)}
                                className="btn-secondary flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap"
                            >
                                <FiEdit2 size={14} /> Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Email (read-only) */}
                <div>
                    <label className="label">Email Address</label>
                    <div className="relative mt-1">
                        <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <div className="input pl-9 cursor-not-allowed opacity-60 select-none flex items-center">
                            {user?.email}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed.</p>
                </div>

                {/* Role */}
                <div>
                    <label className="label">Account Role</label>
                    <div className="flex items-center gap-2 mt-1">
                        <FiShield size={14} className="text-primary-400" />
                        <span className={`capitalize font-medium text-sm ${user?.role === 'admin' ? 'text-primary-400' : 'text-green-400'}`}>
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Appearance card ───────────────────────── */}
            <div className="card">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <FiMonitor size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Appearance</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Choose how the app looks to you.</p>
                    </div>
                </div>

                {/* 3-chip selector */}
                <div className="grid grid-cols-3 gap-3">
                    {THEME_OPTIONS.map(({ value, label, Icon }) => {
                        const isActive = theme === value;
                        return (
                            <button
                                key={value}
                                id={`settings-theme-${value}`}
                                onClick={() => setTheme(value)}
                                className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${isActive
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                    : 'border-gray-700 text-gray-400 hover:border-primary-500/50 hover:text-gray-300'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                                {isActive && <FiCheck size={13} className="text-primary-400" />}
                            </button>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    {theme === 'system' && 'Automatically follows your operating system preference.'}
                    {theme === 'light' && 'Clean and bright for well-lit environments.'}
                    {theme === 'dark' && 'Easy on the eyes in low-light environments.'}
                </p>
            </div>

            {/* Member since */}
            <p className="text-center text-xs text-gray-600">
                Member since {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—'}
            </p>
        </div>
    );
}
