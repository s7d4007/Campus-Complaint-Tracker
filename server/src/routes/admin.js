const express = require('express');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// GET /api/admin/complaints – all complaints with optional filters
router.get('/complaints', auth, adminOnly, async (req, res) => {
    try {
        let query = supabase
            .from('complaints')
            .select(`
        *,
        users(id, name, email),
        complaint_images(public_url),
        assignments(assigned_to_user:users!assignments_assigned_to_fkey(id, name, email))
      `)
            .order('created_at', { ascending: false });

        if (req.query.status) query = query.eq('status', req.query.status);
        if (req.query.category) query = query.eq('category', req.query.category);
        if (req.query.priority) query = query.eq('priority', req.query.priority);
        if (req.query.search) query = query.ilike('title', `%${req.query.search}%`);

        const { data, error } = await query;
        if (error) throw error;

        res.json({ complaints: data });
    } catch (err) {
        console.error('Admin complaints error:', err);
        res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
});

// POST /api/admin/complaints/:id/assign
router.post('/complaints/:id/assign', auth, adminOnly, async (req, res) => {
    const { assigned_to } = req.body;
    if (!assigned_to) return res.status(400).json({ error: 'assigned_to (user id) is required.' });

    try {
        // Remove previous assignment if any
        await supabase.from('assignments').delete().eq('complaint_id', req.params.id);

        const { data, error } = await supabase
            .from('assignments')
            .insert({
                complaint_id: req.params.id,
                assigned_to,
                assigned_by: req.user.id,
            })
            .select()
            .single();

        if (error) throw error;

        // Update status to in_progress
        const { data: complaint } = await supabase
            .from('complaints')
            .update({ status: 'in_progress', updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .select('user_id, title')
            .single();

        // Notify the student
        if (complaint) {
            await supabase.from('notifications').insert({
                user_id: complaint.user_id,
                complaint_id: req.params.id,
                message: `Your complaint "${complaint.title}" has been assigned and is now in progress.`,
                is_read: false,
            });
        }

        res.json({ assignment: data });
    } catch (err) {
        console.error('Assign error:', err);
        res.status(500).json({ error: 'Failed to assign complaint.' });
    }
});

// GET /api/admin/analytics
router.get('/analytics', auth, adminOnly, async (req, res) => {
    try {
        const [byStatus, byCategory, byPriority, recent] = await Promise.all([
            supabase.from('complaints').select('status'),
            supabase.from('complaints').select('category'),
            supabase.from('complaints').select('priority'),
            supabase
                .from('complaints')
                .select('created_at')
                .order('created_at', { ascending: true })
                .limit(500),
        ]);

        const countBy = (arr, key) =>
            arr.reduce((acc, item) => {
                acc[item[key]] = (acc[item[key]] || 0) + 1;
                return acc;
            }, {});

        // Group by date (YYYY-MM-DD)
        const trendMap = {};
        (recent.data || []).forEach((c) => {
            const date = c.created_at.split('T')[0];
            trendMap[date] = (trendMap[date] || 0) + 1;
        });

        res.json({
            total: (byStatus.data || []).length,
            byStatus: countBy(byStatus.data || [], 'status'),
            byCategory: countBy(byCategory.data || [], 'category'),
            byPriority: countBy(byPriority.data || [], 'priority'),
            trend: Object.entries(trendMap).map(([date, count]) => ({ date, count })),
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// GET /api/admin/users – list admin users for assignment dropdown
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('role', 'admin');
        if (error) throw error;
        res.json({ users: data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

module.exports = router;
