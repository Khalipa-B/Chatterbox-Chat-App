const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});


router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post('https://https://chatterbox-server-0zpy.onrender.com/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('File uploaded:', res.data);
    // Send file info via socket if needed
  } catch (error) {
    console.error('Upload error', error);
  }
};


module.exports = router;
