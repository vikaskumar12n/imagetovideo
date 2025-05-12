const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
