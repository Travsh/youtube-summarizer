const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const { getDb } = require('./db'); // Import the getDb function

const app = express();
const port = 3333;

app.use(cors());

const transcribeAudio = async (audioPath) => {
    const apiKey = 'YOUR_OPENAI_API_KEY';
    const form = new FormData();
    form.append('file', fs.createReadStream(audioPath));
    form.append('model', 'whisper-1');

    const headers = form.getHeaders();
    headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: headers
    });
    console.log(response.data.text);
    return response.data.text;
};

const analyzeText = async (text) => {
    const apiKey = 'YOUR_OPENAI_API_KEY';
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4-turbo-preview',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that summarizes video transcript. You can add line break <br> to the end of a paragraph if needed.'
            },
            {
                role: 'user',
                content: `Summarize the following text: ${text}`
            }
        ],
        // max_tokens: 400
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].message.content;
};

app.get('/summarize', async (req, res) => {
    const videoURL = req.query.url;
    
    const videoIdMatch = videoURL.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
  
    if (!videoId) {
      return res.status(400).send('Invalid YouTube link');
    }

    try {
        const db = await getDb(); // Get the database connection
        const collection = db.collection('summaries');
        const existingEntry = await collection.findOne({ videoId });
    
        if (existingEntry) {
          return res.send(existingEntry.summary);
        }
    
        const audioPath = path.resolve(__dirname, 'audio.mp3');
        
        // Download audio
        const audioStream = ytdl(videoURL, { quality: 'highestaudio' });
        audioStream.pipe(fs.createWriteStream(audioPath));
        
        audioStream.on('end', async () => {
          try {
            const transcription = await transcribeAudio(audioPath);
            const summary = await analyzeText(transcription);
    
            // Store in MongoDB
            await collection.insertOne({ videoId, summary, transcription });
    
            res.send(summary);
          } catch (error) {
            res.status(500).send('Error processing audio');
          }
        });
      } catch (error) {
        res.status(500).send('Error accessing database');
      }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
