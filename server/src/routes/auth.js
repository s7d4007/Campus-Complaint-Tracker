const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const { sendMail } = require('../utils/mailer');
const { otpEmail, welcomeEmail } = require('../utils/emailTemplates');

const router = express.Router();

// In-memory OTP store for simplicity. (Use Redis/DB in prod)
const otpStore = new Map();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// POST /api/auth/send-otp
router.post('/send-otp', [
    body('email').isEmail().withMessage('Valid email is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
        const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
        if (existing) return res.status(409).json({ error: 'Email already registered.' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

        const { html, text } = otpEmail(code);
        await sendMail(email, 'Your CampusTracker Verification Code', html, text);
        res.json({ message: 'OTP sent successfully.' });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ error: 'Failed to send OTP email.' });
    }
});

// POST /api/auth/register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('otp').notEmpty().withMessage('OTP is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password, otp, role = 'student' } = req.body;

        const record = otpStore.get(email);
        if (!record || record.code !== otp || Date.now() > record.expiresAt) {
            return res.status(400).json({ error: 'Invalid or expired verification code.' });
        }

        try {
            // Check existing user
            const { data: existing } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) return res.status(409).json({ error: 'Email already registered.' });

            const password_hash = await bcrypt.hash(password, 12);

            const { data: newUser, error } = await supabase
                .from('users')
                .insert({ name, email, password_hash, role: role === 'admin' ? 'student' : role }) // prevent self-promoting to admin
                .select('id, name, email, role, created_at')
                .single();

            if (error) throw error;

            otpStore.delete(email); // Clear the OTP once verified

            // Send Welcome Email asynchronously
            const welcome = welcomeEmail(name);
            sendMail(email, 'Welcome to CampusTracker! 🎉', welcome.html, welcome.text)
                .catch(err => console.error('Welcome email error:', err));

            const token = generateToken(newUser);
            res.status(201).json({ user: newUser, token });
        } catch (err) {
            console.error('Register error:', err);
            res.status(500).json({ error: err.message || 'Server error during registration.' });
        }
    }
);

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, role, password_hash, created_at')
                .eq('email', email)
                .single();

            if (error || !user) return res.status(401).json({ error: 'Invalid email or password.' });

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });

            const { password_hash, ...safeUser } = user;
            const token = generateToken(safeUser);
            res.json({ user: safeUser, token });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: err.message || 'Server error during login.' });
        }
    }
);

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .eq('id', req.user.id)
            .single();

        if (error || !user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// PATCH /api/auth/profile
router.patch('/profile', auth, [
    body('name').trim().notEmpty().withMessage('Name cannot be empty'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    try {
        const { data: updated, error } = await supabase
            .from('users')
            .update({ name })
            .eq('id', req.user.id)
            .select('id, name, email, role, created_at')
            .single();

        if (error) throw error;
        res.json({ user: updated });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

module.exports = router;
