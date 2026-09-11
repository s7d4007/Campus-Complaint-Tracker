import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
    FiArrowRight, FiFileText, FiActivity, FiShield,
    FiBell, FiCheckCircle, FiUsers, FiClock, FiZap
} from 'react-icons/fi';

/* ── Data ───────────────────────────────────────────────────────── */
const FEATURES = [
    {
        icon: FiFileText,
        title: 'Submit Complaints',
        desc: 'Easily file and categorise campus issues with rich descriptions, priority levels, and photo attachments.',
        grad: 'from-blue-500 to-indigo-600',
        glow: 'rgba(99,102,241,0.25)',
    },
    {
        icon: FiActivity,
        title: 'Real-Time Tracking',
        desc: 'Watch your complaint move through every stage — Open → In Progress → Resolved — on a live timeline.',
        grad: 'from-violet-500 to-purple-600',
        glow: 'rgba(139,92,246,0.25)',
    },
    {
        icon: FiShield,
        title: 'Admin Review',
        desc: 'Dedicated administrators review every submission, assign priority, and provide transparent updates.',
        grad: 'from-emerald-500 to-teal-600',
        glow: 'rgba(16,185,129,0.25)',
    },
    {
        icon: FiBell,
        title: 'Instant Notifications',
        desc: 'Get notified the moment your complaint status changes, receives a comment, or gets resolved.',
        grad: 'from-orange-500 to-amber-600',
        glow: 'rgba(245,158,11,0.25)',
    },
];

const STATS = [
    { value: '< 48h', label: 'Avg. Resolution Time', icon: FiClock },
    { value: '100%', label: 'Transparent Process', icon: FiActivity },
    { value: 'Secure', label: 'OTP-Verified Accounts', icon: FiShield },
    { value: 'Open', label: 'To All Students', icon: FiUsers },
];

const TRUST = [
    'Free for all students',
    'OTP-verified sign-up',
    'End-to-end secure',
    'Admin-moderated',
];

const HOW = [
    { step: '01', title: 'Create your account', desc: 'Sign up with your email and verify with a one-time code.' },
    { step: '02', title: 'Submit your complaint', desc: 'Describe the issue, set priority, and attach a photo if needed.' },
    { step: '03', title: 'Track live progress', desc: 'Watch admins update your ticket status in real time.' },
    { step: '04', title: 'Get it resolved', desc: 'Receive a notification the moment your issue is closed.' },
];

/* ── Component ──────────────────────────────────────────────────── */
export default function Welcome() {
    const heroRef = useRef(null);

    /* Subtle parallax on hero orbs */
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const move = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden" style={{ colorScheme: 'dark' }}>

            {/* ── Ambient background orbs ─────────────────────────── */}
            <div ref={heroRef} className="fixed inset-0 pointer-events-none" aria-hidden>
                <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
                        transform: 'translate(var(--mx,0), var(--my,0))', transition: 'transform 0.8s ease'
                    }} />
                <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
                        transform: 'translate(calc(var(--mx,0) * -0.5), calc(var(--my,0) * -0.5))', transition: 'transform 1s ease'
                    }} />
                <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />
            </div>

            {/* ── Navbar ──────────────────────────────────────────── */}
            <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-5
                               border-b border-white/5 backdrop-blur-md bg-gray-950/60 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary-500/40">
                        CC
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        Campus<span className="text-primary-400">Tracker</span>
                    </span>
                </div>
                <nav className="flex items-center gap-3">
                    <Link id="welcome-login" to="/login"
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                        Sign In
                    </Link>
                    <Link id="welcome-register" to="/register"
                        className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5 shadow-lg shadow-primary-500/25">
                        Get Started <FiArrowRight size={14} />
                    </Link>
                </nav>
            </header>

            {/* ── Hero ────────────────────────────────────────────── */}
            <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24">
                {/* Live badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                                bg-primary-500/10 border border-primary-500/25 text-primary-400 text-sm font-medium mb-10">
                    <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    Real-time complaint tracking — now live
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.07] mb-7 tracking-tight">
                    Your Campus.{' '}
                    <span className="gradient-text">Your Voice.</span>
                    <br className="hidden sm:block" />
                    {' '}Our Action.
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
                    Stop waiting in queues and sending emails no one reads.
                    Submit, track, and resolve campus issues — all in one
                    transparent platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link id="hero-register" to="/register"
                        className="btn-primary flex items-center gap-2 text-base px-9 py-3.5 shadow-2xl shadow-primary-500/30 rounded-2xl">
                        Submit a Complaint <FiArrowRight size={18} />
                    </Link>
                    <Link id="hero-login" to="/login"
                        className="flex items-center gap-2 text-base px-9 py-3.5 rounded-2xl border border-white/10
                                     text-gray-300 hover:bg-white/5 hover:border-white/20 transition-all duration-200">
                        Sign In to Dashboard
                    </Link>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-14 text-sm text-gray-500">
                    {TRUST.map(t => (
                        <span key={t} className="flex items-center gap-2">
                            <FiCheckCircle size={13} className="text-green-500 flex-shrink-0" />
                            {t}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats ───────────────────────────────────────────── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="card text-center py-7 hover:-translate-y-1 hover:border-primary-500/30
                                                    transition-all duration-300 group cursor-default">
                            <Icon size={20} className="text-primary-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <p className="text-2xl font-bold gradient-text mb-1">{value}</p>
                            <p className="text-xs text-gray-500 leading-snug">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ────────────────────────────────────────── */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 pb-28">
                <div className="text-center mb-16">
                    <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                        Everything you need<br className="hidden md:block" /> to get heard
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg">
                        A complete platform that bridges the gap between students and administration.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {FEATURES.map(({ icon: Icon, title, desc, grad, glow }) => (
                        <div key={title}
                            className="card group hover:-translate-y-1.5 transition-all duration-300 hover:border-white/20 relative overflow-hidden"
                            style={{ '--glow': glow }}>
                            {/* hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                                style={{ background: `radial-gradient(circle at 30% 50%, var(--glow) 0%, transparent 70%)` }} />
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-5 shadow-lg`}>
                                <Icon size={22} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it works ────────────────────────────────────── */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
                <div className="text-center mb-16">
                    <p className="text-primary-400 text-sm font-semibold tracking-widest uppercase mb-3">How it works</p>
                    <h2 className="text-3xl md:text-5xl font-bold">Four easy steps</h2>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {HOW.map(({ step, title, desc }, i) => (
                        <div key={step} className="relative">
                            {i < HOW.length - 1 && (
                                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-primary-500/40 to-transparent z-0" />
                            )}
                            <div className="card text-left h-full relative z-10 hover:-translate-y-1 transition-all duration-300">
                                <div className="text-3xl font-black gradient-text mb-4 leading-none">{step}</div>
                                <h4 className="font-semibold text-white mb-2 text-sm">{title}</h4>
                                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ───────────────────────────────────────── */}
            <section className="relative z-10 px-6 pb-28">
                <div className="max-w-4xl mx-auto rounded-3xl relative overflow-hidden px-8 py-16 text-center border border-primary-500/20"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)' }}>
                    {/* inner glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.3) 0%, transparent 60%)' }} />
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/50">
                            <FiZap size={26} className="text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to make your campus better?
                        </h2>
                        <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
                            Join students already using CampusTracker to resolve issues faster and smarter.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link id="cta-register" to="/register"
                                className="btn-primary flex items-center gap-2 text-base px-10 py-3.5 shadow-2xl shadow-primary-500/40 rounded-2xl">
                                Create Free Account <FiArrowRight size={18} />
                            </Link>
                            <Link id="cta-login" to="/login"
                                className="text-base px-10 py-3.5 rounded-2xl border border-white/15 text-gray-300
                                             hover:bg-white/5 hover:border-white/25 transition-all duration-200">
                                Already have an account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-white/5 py-10 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">CC</div>
                    <span className="text-gray-400 font-semibold">CampusTracker</span>
                </div>
                <p className="text-gray-600 text-sm">Built for students. Powered by transparency.</p>
            </footer>

        </div>
    );
}
