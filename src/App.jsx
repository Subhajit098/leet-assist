// App.jsx
import React, { useEffect, useState } from "react";
import HintPagination from "./components/HintPagination.jsx";
import "./styles/App.css"
import { sendConfirmationToContentFromApp } from "./appHelpers/sendConfirmationToContentFromApp.js";




function App() {
  const [dataFromBg, setDataFromBg] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleSeeHints = () => {
    // Trigger the message to content.js

    sendConfirmationToContentFromApp();
    setClicked(true);
  };

  const resetValue=()=>{
    setDataFromBg([]);
    setClicked(false);
  }

useEffect(() => {
  // Helper to get tab info as a promise
  const getTab = (tabId) =>
    new Promise((resolve, reject) => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(tab);
      });
    });

  // Called whenever active tab changes
  const handleTabActivated = async ({ tabId }) => {
    try {
      const tab = await getTab(tabId);
      console.log("Tab switched to:", tab.url);
      resetValue();
    } catch (err) {
      console.error("Error getting tab info:", err.message);
    }
  };

  // Called whenever tab URL updates
  const handleTabUpdated = (tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      const newQUrl = changeInfo.url;
      chrome.storage.local.get(["latestQuestionUrl"], (result) => {
        const lastQUrl = result.latestQuestionUrl || null;

        // Skip if only difference is /description/
        if (
          lastQUrl &&
          ((lastQUrl + "description/") === newQUrl ||
            (newQUrl + "description/") === lastQUrl ||
            lastQUrl === newQUrl)
        ) {
          console.log("⚠️ Ignoring /description/ ↔ base mismatch");
          return;
        }

        console.log(`Tab ${tabId} navigated to: ${newQUrl}`);
        resetValue();
      });
    }
  };

  // Message listener from background
  const handleMessageFromBg = (message, sender, sendResponse) => {
    if (message?.type === "DATA_FROM_BACKGROUND_TO_APP") {
      setDataFromBg(message.payload);
      sendResponse({ received: true });
    }
    return true; // for async if needed
  };

  // Attach listeners
  chrome.runtime.onMessage.addListener(handleMessageFromBg);
  chrome.tabs.onActivated.addListener(handleTabActivated);
  chrome.tabs.onUpdated.addListener(handleTabUpdated);

  // Cleanup on unmount
  return () => {
    chrome.runtime.onMessage.removeListener(handleMessageFromBg);
    chrome.tabs.onActivated.removeListener(handleTabActivated);
    chrome.tabs.onUpdated.removeListener(handleTabUpdated);
  };
}, []);

  return (
  <div className="parentBody">
    <h2>🚀 LeetCode Buddy</h2>

    {/* Disable button if we already have hints */}
    <button onClick={handleSeeHints} disabled={clicked || !!dataFromBg?.hints?.length}>
      See hints!
    </button>

    <div className="childBody">
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
