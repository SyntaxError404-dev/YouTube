const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Utility function to fetch data from the main API
async function fetchVideoData(url) {
    try {
        const response = await axios.get(`https://www.samirxpikachu.run.place/ytb?url=${url}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch video data');
    }
}

// MP3 endpoint
app.get('/mp3', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const data = await fetchVideoData(url);
        
        // Set headers for audio download
        res.setHeader('Content-Disposition', `attachment; filename="${data.title}.mp3"`);
        res.setHeader('Content-Type', 'audio/mp3');

        // Pipe the audio stream to response
        const audioStream = await axios({
            method: 'get',
            url: data.audios,
            responseType: 'stream'
        });

        audioStream.data.pipe(res);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// MP4 endpoint
app.get('/mp4', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const data = await fetchVideoData(url);
        
        // Set headers for video download
        res.setHeader('Content-Disposition', `attachment; filename="${data.title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        // Pipe the video stream to response
        const videoStream = await axios({
            method: 'get',
            url: data.videos,
            responseType: 'stream'
        });

        videoStream.data.pipe(res);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
