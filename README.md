# Project Description
YouTube Video Summarizer
The YouTube Video Summarizer is a web application that allows users to input a YouTube video URL and receive a concise summary of the video's content. This application leverages modern web technologies and integrates several services to provide a seamless and efficient user experience.

## Features:
YouTube Link Validation: Ensures the input URL is a valid YouTube link before processing.
Audio Download and Processing: Downloads the audio stream from the provided YouTube video URL and processes it to extract transcriptions.
AI-Powered Transcription: Uses OpenAI's Whisper model to transcribe the audio into text.
Text Summarization: Summarizes the transcribed text using OpenAI's GPT-3.5-turbo model.
Database Integration: Stores video IDs, summaries, and transcriptions in MongoDB to avoid redundant processing and speed up subsequent requests.
Loading State Management: Provides feedback to users with a loading spinner while the video is being processed.

## How It Works:
User Input: The user enters a YouTube video URL into the input field on the frontend.
Validation: The application validates the URL to ensure it is a proper YouTube link.
Backend Processing:
The backend checks if the video ID already exists in the MongoDB database.
If it exists, the backend retrieves the summary from the database.
If it does not exist, the backend downloads the audio stream from the YouTube video, transcribes it using OpenAI's Whisper model, and summarizes the transcription using OpenAI's GPT-4-turbo model.
The new summary and transcription are stored in the database for future use.
Display Summary: The frontend displays the summary to the user.
Tech Stack:
Frontend: React, Axios, react-spinners
Backend: Node.js, Express.js, ytdl-core, axios, form-data
Database: MongoDB (MongoDB Atlas for cloud hosting)

## How to Run the Project:
Clone the Repository: git clone <repository-url>
Install Dependencies: npm install in both the frontend and backend directories.
Set Up Environment Variables: Configure your MongoDB URI and OpenAI API key in a .env file.
Run the Backend: node server.js
Run the Frontend: npm start in the React project directory.
Open the Application: Access the application in your browser at http://localhost:3000.