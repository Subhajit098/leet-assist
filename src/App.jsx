import React, { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState(null); // state to store the URL received 


  useEffect(() => {
    // 1. Read the latest URL when popup loads
    chrome.storage.local.get("latestQuestionUrl", (result) => {
      if (result.latestQuestionUrl) {
        console.log("📂 Loaded from storage:", result.latestQuestionUrl);
        setUrl(result.latestQuestionUrl);
      }
    });

    // 2. Listen for storage changes (if new URL is stored)
    function handleStorageChange(changes, areaName) {
      if (areaName === "local" && changes.latestQuestionUrl) {
        console.log("🔄 Storage updated:", changes.latestQuestionUrl.newValue);
        setUrl(changes.latestQuestionUrl.newValue);
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
  }, [url]);

  console.log("URL : ",url)

  return (
    <div style={{ padding: "1rem", width: "280px" }}>
      <h2>🚀 LeetCode Buddy</h2>

      {/* Button to trigger injection of content.js and fetch URL */}
      <button >{url}</button>

      {/* Make an API call here once you have the URL (inside useEffect) */}
      {url && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            🔗{" "}
            {/* Always add rel="noopener noreferrer" when using target="_blank" for security */}
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </p>
        </div>
      )}

    </div>
  );
}

export default App;
