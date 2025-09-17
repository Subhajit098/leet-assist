// App.jsx
import React, { useEffect, useState } from "react";
import HintPagination from "./components/HintPagination.jsx";
// import { sendConfirmationToContentFromApp } from "../public/utils/sendConfirmationToContentFromApp.js";



// using the tabs.query approach
const sendConfirmationToContentFromApp = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.warn("⚠️ No active tab found");
      return;
    }
    const activeTabId = tabs[0].id;

    // error handling to check if the content script is injected or not into the webpage 
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTabId }, // also fixed tabId reference
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          alert("Please refresh or try again later !");
          console.error("❌ Could not inject content script:", chrome.runtime.lastError.message);
          return;
        }

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
      }
    ); 
  });
};



function App() {
  const [dataFromBg, setDataFromBg] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleSeeHints = () => {
    // Trigger the message to content.js
    sendConfirmationToContentFromApp();
    setClicked(true);
  };

  useEffect(() => {
    const handleMessageFromBg = (message, sender, sendResponse) => {
      if (message && message.type === "DATA_FROM_BACKGROUND_TO_APP") {
          setDataFromBg((prevState)=>{
            return message.payload;
          });
        // sendResponse to confirm receipt (optional)
          sendResponse({ received: true });

        // no need to return true here since we responded synchronously
      }
    };

    // Define the listener function
    const handleTabUpdate = (tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        console.log(`Tab ${tabId} navigated to: ${changeInfo.url}`);
        // Call a function to update your extension's state
        setDataFromBg([]);
        setClicked(false)
      }
    };

    chrome.runtime.onMessage.addListener(handleMessageFromBg);

    // Add the listener for any tab changes
    chrome.tabs.onUpdated.addListener(handleTabUpdate);


    return () => {
      // cleanup
      try {
        chrome.runtime.onMessage.removeListener(handleMessageFromBg);
        chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      } catch (e) {
        console.warn("Error removing listener:", e);
      }
    };
  }, []); // register once

  return (
  <div style={{ padding: "1rem", width: "280px" }}>
    <h2>🚀 LeetCode Buddy</h2>

    {/* Disable button if we already have hints */}
    <button onClick={handleSeeHints} disabled={clicked || !!dataFromBg?.hints?.length}>
      See hints!
    </button>

    <div style={{ marginTop: "1rem" }}>
      {dataFromBg?.hints ? (
        <HintPagination data={dataFromBg.hints}/>
      ) : clicked ? (
        <p>Fetching hints .....</p>
      ) : (
        <p>Click the button to fetch hints</p>
      )}
    </div>
  </div>
  );

}

export default App;
