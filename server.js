require('dotenv').config();

const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');

const app = express();
const upload = multer();

// Use the environment variable
const GOFILE_API_TOKEN = process.env.GOFILE_API_TOKEN;

// Proxy endpoint for file uploads
app.post('/api/upload-gofile', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    // Forward the upload request to Gofile
    const uploadRes = await axios.post('https://upload.gofile.io/uploadfile', formData, {
      headers: { ...formData.getHeaders() }
    });

    res.json(uploadRes.data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
});

// Proxy endpoint to create a direct link
app.post('/api/gofile-direct-link', express.json(), async (req, res) => {
 const { contentId } = req.body;

 try {
  const directLinkRes = await axios.post(
   `https://api.gofile.io/contents/${contentId}/directlinks`,
   {},
   {
    headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${GOFILE_API_TOKEN}`
    }
   }
  );

  res.json(directLinkRes.data);
 } catch (error) {
  res.status(500).json({ status: 'error', message: 'Failed to create direct link' });
 }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));