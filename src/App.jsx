// App.jsx
import React, { useEffect, useState } from "react";
import HintPagination from "./components/HintPagination.jsx";
// import { sendConfirmationToContentFromApp } from "../public/utils/sendConfirmationToContentFromApp.js";
import "./styles/App.css"



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


async function getLastUrl() {
  try {
    const result = await chrome.storage.local.get(["latestQuestionUrl"]);
    const lastUrl = result.latestQuestionUrl || null;
    console.log("Last stored URL:", lastUrl);
    return lastUrl;
  } catch (err) {
    console.error("Error reading from storage:", err);
    return null;
  }
}



function App() {
  const [dataFromBg, setDataFromBg] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleSeeHints = () => {
    // Trigger the message to content.js
    sendConfirmationToContentFromApp();
    setClicked(true);
  };

  useEffect(() => {

    // Notify background that panel has mounted
    chrome.runtime.sendMessage({ type: "PANEL_LOADED" }, (response) => {
      console.log("Background response:", response.status);
    });

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

  // Define the tab change listener function
  const handleTabUpdate = (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const newQUrl = changeInfo.url;

  chrome.storage.local.get(["latestQuestionUrl"], (result) => {
      const lastQUrl = result.latestQuestionUrl || null;

      // Skip reset if the only difference is /description/ or the new URL is same as the OLD URL
      let condition1=((lastQUrl + "description/") === newQUrl ||
          (newQUrl + "description/") === lastQUrl);
      let condition2=(lastQUrl===newQUrl);
      if (
        lastQUrl &&
        (condition1 || condition2)
      ) {
        console.log("⚠️ Ignoring /description/ ↔ base mismatch");
        return;
      }

      console.log(`Tab ${tabId} navigated to: ${newQUrl}`);

      setDataFromBg([]);
      setClicked(false);
    });
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
