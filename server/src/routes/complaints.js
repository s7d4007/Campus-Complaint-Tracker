const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

const VALID_CATEGORIES = ['infrastructure', 'hostel', 'academics', 'canteen', 'transport', 'safety', 'other'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'rejected'];

// POST /api/complaints  – create a new complaint
router.post(
    '/',
    auth,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('category').isIn(VALID_CATEGORIES).withMessage('Invalid category'),
        body('priority').isIn(VALID_PRIORITIES).withMessage('Invalid priority'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { title, description, category, priority, image_urls = [] } = req.body;

        try {
            const { data: complaint, error } = await supabase
                .from('complaints')
                .insert({
                    user_id: req.user.id,
                    title,
                    description,
                    category,
                    priority,
                    status: 'open',
                })
                .select()
                .single();

            if (error) throw error;

            // Attach images if any
            if (image_urls.length > 0) {
                const images = image_urls.map((url) => ({
                    complaint_id: complaint.id,
                    public_url: url,
                    storage_path: url,
                }));
                await supabase.from('complaint_images').insert(images);
            }

            res.status(201).json({ complaint });
        } catch (err) {
            console.error('Create complaint error:', err);
            res.status(500).json({ error: 'Failed to create complaint.' });
        }
    }
);

// GET /api/complaints  – student: own | admin: all
router.get('/', auth, async (req, res) => {
    try {
        let query = supabase
            .from('complaints')
            .select('*, complaint_images(public_url), users(name, email)')
            .order('created_at', { ascending: false });

        if (req.user.role !== 'admin') {
            query = query.eq('user_id', req.user.id);
        }

        // Optional filters
        if (req.query.status) query = query.eq('status', req.query.status);
        if (req.query.category) query = query.eq('category', req.query.category);
        if (req.query.priority) query = query.eq('priority', req.query.priority);

        const { data, error } = await query;
        if (error) throw error;

        res.json({ complaints: data });
    } catch (err) {
        console.error('Get complaints error:', err);
        res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
});

// GET /api/complaints/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const { data: complaint, error } = await supabase
            .from('complaints')
            .select(`
        *,
        complaint_images(id, public_url, storage_path, created_at),
        users(id, name, email),
        assignments(id, created_at, assigned_to_user:users!assignments_assigned_to_fkey(id, name, email)),
        comments(id, content, created_at, users(id, name, role))
      `)
            .eq('id', req.params.id)
            .single();

        if (error || !complaint) return res.status(404).json({ error: 'Complaint not found.' });

        // Students can only view their own
        if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        res.json({ complaint });
    } catch (err) {
        console.error('Get complaint error:', err);
        res.status(500).json({ error: 'Failed to fetch complaint.' });
    }
});

// PATCH /api/complaints/:id/status – admin only
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    try {
        const { data: complaint, error } = await supabase
            .from('complaints')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select('*, user_id')
            .single();

        if (error || !complaint) return res.status(404).json({ error: 'Complaint not found.' });

        // Create notification for complaint owner
        await supabase.from('notifications').insert({
            user_id: complaint.user_id,
            complaint_id: complaint.id,
            message: `Your complaint "${complaint.title}" status has been updated to "${status}".`,
            is_read: false,
        });

        res.json({ complaint });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: 'Failed to update status.' });
    }
});

// DELETE /api/complaints/:id – student deletes own open complaint
router.delete('/:id', auth, async (req, res) => {
    try {
        const { data: complaint, error } = await supabase
            .from('complaints')
            .select('user_id, status')
            .eq('id', req.params.id)
            .single();

        if (error || !complaint) return res.status(404).json({ error: 'Complaint not found.' });

        if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        if (req.user.role !== 'admin' && complaint.status !== 'open') {
            return res.status(400).json({ error: 'Only open complaints can be deleted.' });
        }

        await supabase.from('complaints').delete().eq('id', req.params.id);
        res.json({ message: 'Complaint deleted.' });
    } catch (err) {
        console.error('Delete complaint error:', err);
        res.status(500).json({ error: 'Failed to delete complaint.' });
    }
});

module.exports = router;
