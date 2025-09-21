const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Gofile API Token from Render's environment variables
const GOFILE_API_TOKEN = process.env.GOFILE_API_TOKEN;

// Proxy endpoint for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { folderId, token } = req.body;
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);
    formData.append('token', GOFILE_API_TOKEN); 
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const uploadRes = await axios.post('https://upload.gofile.io/uploadfile', formData, {
      headers: { ...formData.getHeaders() }
    });

    res.json(uploadRes.data);
  } catch (error) {
    console.error('Upload error:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
});

// Proxy endpoint to create a direct link
app.post('/api/direct-link', async (req, res) => {
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ status: 'error', message: 'contentId is required' });
    }

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
    console.error('Direct link error:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: 'error', message: 'Failed to create direct link' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});