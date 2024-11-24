const express = require("express");
const axios = require("axios");
const app = express();

app.get("/mp3", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Please provide a valid YouTube URL." });
  }

  try {
    // Fetch data from the API
    const response = await axios.get(`https://www.samirxpikachu.run.place/ytb?url=${encodeURIComponent(url)}`);
    const data = response.data;

    // Check if the API returned a valid response
    if (!data.audios) {
      return res.status(500).json({ error: "Audio not available for this video." });
    }

    // Send the audio link and metadata
    res.json({
      success: true,
      message: "Audio is ready for download.",
      title: data.title,
      author: data.author,
      duration: `${Math.floor(data.duration / 60)}:${data.duration % 60}`,
      image: data.image,
      audioLink: data.audios
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.get("/mp4", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Please provide a valid YouTube URL." });
  }

  try {
    // Fetch data from the API
    const response = await axios.get(`https://www.samirxpikachu.run.place/ytb?url=${encodeURIComponent(url)}`);
    const data = response.data;

    // Check if the API returned a valid response
    if (!data.videos) {
      return res.status(500).json({ error: "Video not available for this URL." });
    }

    // Send the video link and metadata
    res.json({
      success: true,
      message: "Video is ready for download.",
      title: data.title,
      author: data.author,
      duration: `${Math.floor(data.duration / 60)}:${data.duration % 60}`,
      image: data.image,
      videoLink: data.videos
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

// Export the app (for serverless environments like Vercel)
module.exports = app;

// Start the app (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
