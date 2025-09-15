// App.jsx
import React, { useEffect, useState } from "react";
// import { sendConfirmationToContentFromApp } from "../public/utils/sendConfirmationToContentFromApp.js";

const sendConfirmationToContentFromApp = () => {
    chrome.runtime.sendMessage(
      { type: "CONFIRMATION_FROM_APP_TO_CONTENT" },
      (response) => {

        // handling if the message didn't reach the content
        if(response && response.status)
          console.log("Response from Content:", response.status);

        else {
          console.log("Response didn't react to Content.js !")
        }
      }
    );
  };

function App() {
  const [dataFromBg, setDataFromBg] = useState("");

  const handleSeeHints = () => {
    // Trigger the message to content.js
    sendConfirmationToContentFromApp();
  };

  useEffect(() => {
    const handleMessageFromBg = (message, sender, sendResponse) => {
      if (message && message.type === "DATA_FROM_BACKGROUND_TO_APP") {
        setDataFromBg(message.payload);
        // sendResponse to confirm receipt (optional)
          sendResponse({ received: true });

        // no need to return true here since we responded synchronously
      }
    };

    chrome.runtime.onMessage.addListener(handleMessageFromBg);

    return () => {
      // cleanup
      try {
        chrome.runtime.onMessage.removeListener(handleMessageFromBg);
      } catch (e) {
        console.warn("Error removing listener:", e);
      }
    };
  }, []); // register once

  return (
    <div style={{ padding: "1rem", width: "280px" }}>
      <h2>🚀 LeetCode Buddy</h2>

      <button onClick={handleSeeHints}>See hints!</button>

      <div style={{ marginTop: "1rem" }}>
        {dataFromBg ? <p>{dataFromBg}</p> : <p>Click the button to fetch hints...</p>}
      </div>
    </div>
  );
}

export default App;
