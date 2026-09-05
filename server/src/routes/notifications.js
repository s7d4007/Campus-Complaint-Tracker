const express = require('express');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications
router.get('/', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*, complaints(id, title)')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ notifications: data });
    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ notification: data });
    } catch (err) {
        console.error('Mark read error:', err);
        res.status(500).json({ error: 'Failed to update notification.' });
    }
});

// PATCH /api/notifications/read-all  – mark all as read
router.patch('/read-all', auth, async (req, res) => {
    try {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', req.user.id)
            .eq('is_read', false);

        res.json({ message: 'All notifications marked as read.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notifications.' });
    }
});

module.exports = router;
