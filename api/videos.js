// /api/videos.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const dirPath = path.join(process.cwd(), 'public/videos');
  try {
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mp4'));
    const videoUrls = files.map(file => `/videos/${file}`);
    res.status(200).json({ videos: videoUrls });
  } catch (err) {
    console.error('Error reading videos:', err);
    res.status(500).json({ error: 'Failed to load videos' });
  }
};
