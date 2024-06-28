import React, { useState } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css';

function App() {
  const [videoURL, setVideoURL] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setVideoURL(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSummary('');
    try {
      const response = await axios.get('http://localhost:3333/summarize', {
        params: { url: videoURL },
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Error fetching summary. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Video Summarizer</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={videoURL}
            onChange={handleInputChange}
          />
          <button onClick={handleSubmit}>Summarize</button>
        </div>
        {loading && (
          <div className="loader">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
          </div>
        )}
        {summary && !loading && (
          <div className="summary">
            <h2>Summary:</h2>
            <div className="summary-text">{summary}</div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;