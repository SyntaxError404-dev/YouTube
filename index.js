const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable CORS if needed
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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
            return res.status(400).json({ 
                status: false,
                message: 'URL parameter is required'
            });
        }

        const data = await fetchVideoData(url);
        
        res.json({
            status: true,
            result: {
                title: data.title,
                duration: data.duration,
                author: data.author,
                thumbnail: data.image,
                download_url: data.audios
            }
        });

    } catch (error) {
        res.status(500).json({ 
            status: false,
            message: error.message 
        });
    }
});

// MP4 endpoint
app.get('/mp4', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ 
                status: false,
                message: 'URL parameter is required'
            });
        }

        const data = await fetchVideoData(url);
        
        res.json({
            status: true,
            result: {
                title: data.title,
                duration: data.duration,
                author: data.author,
                thumbnail: data.image,
                download_url: data.videos
            }
        });

    } catch (error) {
        res.status(500).json({ 
            status: false,
            message: error.message 
        });
    }
});

// Add a simple home route
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'YouTube Downloader API',
        endpoints: {
            mp3: '/mp3?url=YOUTUBE_URL',
            mp4: '/mp4?url=YOUTUBE_URL'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: false,
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
