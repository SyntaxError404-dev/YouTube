const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/mp3", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL.");
  }

  try {
    const apiUrl = `https://smfahim.xyz/ytb?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const audioUrl = response.data?.data?.audio;
    const title = response.data?.data?.title || "audio";

    if (!audioUrl) {
      return res.status(500).send("Failed to retrieve audio link from the API.");
    }

    // Set headers for direct download with the title
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mp4");

    // Stream the audio content
    const audioStream = await axios.get(audioUrl, { responseType: "stream" });
    audioStream.data.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.get("/mp4", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL.");
  }

  try {
    const apiUrl = `https://smfahim.xyz/ytb?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    const videoUrl = response.data?.data?.video;
    const title = response.data?.data?.title || "video";

    if (!videoUrl) {
      return res.status(500).send("Failed to retrieve video link from the API.");
    }

    // Set headers for direct download with the title
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    // Stream the video content
    const videoStream = await axios.get(videoUrl, { responseType: "stream" });
    videoStream.data.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
