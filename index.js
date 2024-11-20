const express = require('express');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const port = 3000;

app.get('/mp4', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const { data } = await axios.get(`https://www.x-noobs-api.000.pe/m/ytDl?url=${encodeURIComponent(videoUrl)}`);
        const downloadUrl = data.dUrl;

        if (!downloadUrl) {
            return res.status(500).send('Unable to retrieve download URL');
        }

        const downloadResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', 'attachment; filename="ytdl-mp4-nexus.mp4"');
        downloadResponse.data.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error.message);
        res.status(500).send('Error downloading file');
    }
});

app.get('/mp3', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const { data } = await axios.get(`https://www.x-noobs-api.000.pe/m/ytDl?url=${encodeURIComponent(videoUrl)}`);
        const downloadUrl = data.dUrl;

        if (!downloadUrl) {
            return res.status(500).send('Unable to retrieve download URL');
        }

        const downloadResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', 'attachment; filename="ytdl-mp3-nexus.mp3"');

        ffmpeg(downloadResponse.data)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('error', (err) => {
                console.error('Error converting to audio:', err.message);
                res.status(500).send('Error converting to audio');
            })
            .pipe(res, { end: true });
    } catch (error) {
        console.error('Error downloading file:', error.message);
        res.status(500).send('Error downloading file');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
