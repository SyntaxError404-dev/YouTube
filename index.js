const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for Render or local 3000

// MP3 Download Route
app.get("/mp3", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL.");
  }

  try {
    const apiUrl = `https://www.samirxpikachu.run.place/ytb?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, { timeout: 15000 }); // 15-second timeout

    const audioUrl = response.data?.audios;
    const title = response.data?.title || "audio";

    if (!audioUrl) {
      return res.status(500).send("Failed to retrieve audio link from the API.");
    }

    // Set headers for downloading with title as filename
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    // Stream the audio content directly to the client
    const audioStream = await axios.get(audioUrl, { responseType: "stream" });
    audioStream.data.pipe(res);
  } catch (error) {
    console.error("Error in /mp3 route:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// MP4 Download Route
app.get("/mp4", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL.");
  }

  try {
    const apiUrl = `https://www.samirxpikachu.run.place/ytb?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl, { timeout: 15000 }); // 15-second timeout

    const videoUrl = response.data?.videos;
    const title = response.data?.title || "video";

    if (!videoUrl) {
      return res.status(500).send("Failed to retrieve video link from the API.");
    }

    // Set headers for downloading with title as filename
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    // Stream the video content directly to the client
    const videoStream = await axios.get(videoUrl, { responseType: "stream" });
    videoStream.data.pipe(res);
  } catch (error) {
    console.error("Error in /mp4 route:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).send("An internal server error occurred.");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
