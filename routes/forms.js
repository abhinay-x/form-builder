const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const { upload, handleUploadError } = require('../middleware/upload');

// GET /api/forms - Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/forms/:id - Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/forms - Create new form
router.post('/', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/forms/:id - Update form
router.put('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/forms/:id - Delete form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/forms/:id/publish - Publish/unpublish form
router.post('/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    const status = isPublished ? 'published' : 'draft';
    const updateData = { 
      status, 
      updatedAt: Date.now() 
    };
    
    // Set publishedAt timestamp when publishing
    if (isPublished) {
      updateData.publishedAt = Date.now();
    }
    
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/forms/upload - Upload image
router.post('/upload', upload.single('image'), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/forms/:id/preview - Get form for preview (published forms only)
router.get('/:id/preview', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    if (!form.isPublished) {
      return res.status(403).json({ error: 'Form is not published' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/forms/duplicate/:id - Duplicate form
router.post('/duplicate/:id', async (req, res) => {
  try {
    const originalForm = await Form.findById(req.params.id);
    if (!originalForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const duplicatedForm = new Form({
      ...originalForm.toObject(),
      _id: undefined,
      title: `${originalForm.title} (Copy)`,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await duplicatedForm.save();
    res.status(201).json(duplicatedForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;