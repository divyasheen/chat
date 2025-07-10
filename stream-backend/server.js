const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;


const chatServer = StreamChat.getInstance(API_KEY, API_SECRET);

// POST /get-token - Generates a token for a user
app.post('/get-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const token = chatServer.createToken(userId);
    console.log(`✅ Token created for user: ${userId}`);
    return res.json({ token });
  } catch (err) {
    console.error('❌ Error generating token:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Token server running on http://localhost:${PORT}`);
});
