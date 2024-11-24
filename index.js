const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Base API URL
const BASE_API_URL = 'https://www.samirxpikachu.run.place/ytb?url=';

// Helper function to download and save the file
async function downloadFile(url, filename, res) {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = path.join(__dirname, filename);

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      res.download(filePath, filename, (err) => {
        if (!err) fs.unlinkSync(filePath); // Delete file after download
      });
    });

    writer.on('error', () => {
      res.status(500).send('Error downloading the file.');
    });
  } catch (error) {
    res.status(500).send('Error fetching file from the API.');
  }
}

// MP3 Endpoint
app.get('/mp3', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('Please provide a YouTube video URL.');
  }

  try {
    const apiResponse = await axios.get(`${BASE_API_URL}${videoUrl}`);
    const audioUrl = apiResponse.data.audios;

    if (!audioUrl) {
      return res.status(500).send('Audio file not found.');
    }

    await downloadFile(audioUrl, 'audio.mp3', res);
  } catch (error) {
    res.status(500).send('Failed to process the request.');
  }
});

// MP4 Endpoint
app.get('/mp4', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('Please provide a YouTube video URL.');
  }

  try {
    const apiResponse = await axios.get(`${BASE_API_URL}${videoUrl}`);
    const videoUrlData = apiResponse.data.videos;

    if (!videoUrlData) {
      return res.status(500).send('Video file not found.');
    }

    await downloadFile(videoUrlData, 'video.mp4', res);
  } catch (error) {
    res.status(500).send('Failed to process the request.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
