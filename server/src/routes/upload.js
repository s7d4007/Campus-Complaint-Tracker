const express = require('express');
const multer = require('multer');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /api/upload  – upload image to Supabase Storage
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided.' });

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only JPEG, PNG, WEBP, and GIF images are allowed.' });
    }

    try {
        const ext = req.file.originalname.split('.').pop();
        const fileName = `${req.user.id}/${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from('complaint-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (error) throw error;

        const { data: urlData } = supabase.storage
            .from('complaint-images')
            .getPublicUrl(data.path);

        res.json({ url: urlData.publicUrl, path: data.path });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload image.' });
    }
});

module.exports = router;
