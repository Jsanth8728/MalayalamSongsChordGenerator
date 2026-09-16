import { useState } from "react";
import "./App.css";

function App() {
  const [malayalam, setMalayalam] = useState("");
  const [manglish, setManglish] = useState("");
  const [english, setEnglish] = useState("");

  async function convertText() {
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

        setManglish(data.result);
        setEnglish(data.result);

    } catch (error) {
        console.error("Error:", error);
    }
  }

  return (
    <div className="app">
      <h1>Malayalam Song Assistant</h1>

      <div className="input-section">
        <h2>Malayalam Lyrics</h2>

        <textarea
          value={malayalam}
          onChange={(e) => setMalayalam(e.target.value)}
          placeholder="Paste Malayalam lyrics here..."
        />

        <button onClick={convertText}>
          Convert
        </button>
      </div>

      <div className="results">
        <div>
          <h2>Manglish</h2>
          <p>{manglish}</p>
        </div>
        <div>
          <h2>English</h2>
          <p>{english}</p>
        </div>
      </div>
    </div>
  );
}

export default App;