const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// GET /api/complaints/:id/comments
router.get('/', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('id, content, created_at, users(id, name, role)')
            .eq('complaint_id', req.params.id)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json({ comments: data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments.' });
    }
});

// POST /api/complaints/:id/comments
router.post(
    '/',
    auth,
    [body('content').trim().notEmpty().withMessage('Comment cannot be empty')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    complaint_id: req.params.id,
                    user_id: req.user.id,
                    content: req.body.content,
                })
                .select('id, content, created_at, users(id, name, role)')
                .single();

            if (error) throw error;
            res.status(201).json({ comment: data });
        } catch (err) {
            res.status(500).json({ error: 'Failed to add comment.' });
        }
    }
);

module.exports = router;
