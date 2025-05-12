const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Helper function to save a stream to a file reliably
const saveVideoToFile = (stream, outputPath) => {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    stream.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

exports.generateVideo = async (req, res) => {
  try {
    const { file } = req;
    const imagePath = path.join(__dirname, '../uploads', file.filename);

    // STEP 1: Read image as base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    // STEP 2: Call AIMLAPI to generate video
    const response = await axios.post(
      'https://api.aimlapi.com/v2/generate/video/google/generation',
      {
        model: 'veo2',
        aspect_ratio: '16:9',
        duration: 5,
        image: imageBase64,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIML_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const videoUrl = response.data.videoUrl;
    if (!videoUrl) {
      return res.status(500).json({ message: 'Video URL missing in API response' });
    }

    // STEP 3: Download video from API response
    const videoPath = path.join(__dirname, '../uploads', 'generated_video.mp4');
    const videoStream = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream',
    });

    // STEP 4: Save it locally first
    await saveVideoToFile(videoStream.data, videoPath);

    // STEP 5: Trim to 5 seconds using ffmpeg
    const finalPath = path.join(__dirname, '../uploads', 'final_video.mp4');

    ffmpeg(videoPath)
      .setStartTime(0)
      .setDuration(5)
      .output(finalPath)
      .audioCodec('aac')
      .videoCodec('libx264')
      .format('mp4')
      .on('end', () => {
        const finalVideoUrl = `http://localhost:5000/uploads/final_video.mp4`;
        res.json({ videoUrl: finalVideoUrl });

        // Clean up temp files
        fs.unlinkSync(imagePath);
        fs.unlinkSync(videoPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).send('Error processing the video');
      })
      .run();
  } catch (error) {
    console.error('Video generation failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Video generation failed' });
  }
};
