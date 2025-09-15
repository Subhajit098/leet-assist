// App.jsx
import React, { useEffect, useState } from "react";
// import { sendConfirmationToContentFromApp } from "../public/utils/sendConfirmationToContentFromApp.js";



// using the tabs.query approach
const sendConfirmationToContentFromApp = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.warn("⚠️ No active tab found");
      return;
    }
    const activeTabId = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTabId,
      { type: "CONFIRMATION_FROM_APP_TO_CONTENT" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn("❌ Error sending to content:", chrome.runtime.lastError.message);
          return;
        }

        if (response && response.status) {
          console.log("✅ Response from Content:", response.status);
        } else {
          console.log("❌ Response didn't reach Content.js!");
        }
      }
    );
  });
};


function App() {
  const [dataFromBg, setDataFromBg] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleSeeHints = () => {
    // Trigger the message to content.js
    sendConfirmationToContentFromApp();
    setClicked((prevState)=>{
      return !prevState;
    });
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
        {/* {dataFromBg ? <p>{dataFromBg}</p> : <p>Click the button to fetch hints...</p>} */}
        {
          (()=>{
            if(dataFromBg){
              <p>{dataFromBg}</p>
            } else if(!dataFromBg && clicked){
              <p>Fetching hints .....</p>
            } else if(!dataFromBg && !clicked){
              <p>Click the button to fetch hints</p>
            }
          })()
        }
      </div>
    </div>
  );
}

export default App;
