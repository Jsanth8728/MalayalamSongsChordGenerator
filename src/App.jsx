import { useState } from "react";
import "./App.css";

function App() {
  const [malayalam, setMalayalam] = useState("");
  const [manglish, setManglish] = useState("");
  const [english, setEnglish] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  async function convertText() {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:3001/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lyrics: malayalam
            })
        });

        const data = await response.json();

        setManglish(data.manglish);
        setEnglish(data.english);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
}

async function uploadAudio() {
    if (!audioFile) {
        return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
        const response = await fetch("http://localhost:3001/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error("Upload error:", error);
    }
}

  return (
    <div className="app">
      <h1>Malayalam Song Assistant</h1>

      <h2>Song Audio</h2>
        <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0])}
        />

        {audioFile && (
            <>
                <p>Selected: {audioFile.name}</p>

                <button onClick={uploadAudio}>
                    Upload Audio
                </button>
            </>
        )}

      <div className="input-section">
        <h2>Malayalam Lyrics</h2>

        <textarea
          value={malayalam}
          onChange={(e) => setMalayalam(e.target.value)}
          placeholder="Paste Malayalam lyrics here..."
        />
      </div>

      <div className="buttons">
        <button onClick={convertText} disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>

        <button onClick={() => {
            setMalayalam("");
            setManglish("");
            setEnglish("");
        }}>
            Clear
        </button>

        {loading && <p>Translating lyrics...</p>}
      </div>

      <div className="results">
        <div>
          <h2>Manglish</h2>
          <textarea
            value={manglish}
            onChange={(e) => setManglish(e.target.value)}
            placeholder="Manglish lyrics will appear here..."
          />
        </div>
        <div>
          <h2>English</h2>
          <textarea
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="English translation will appear here..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;