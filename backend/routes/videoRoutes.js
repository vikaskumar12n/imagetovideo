const express = require('express');
const multer = require('multer');
const path = require('path'); 
const router = express.Router();

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
  
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext; 
    cb(null, filename); 
  },
});


const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    
    const videoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ videoUrl });
  
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});

module.exports = router;
