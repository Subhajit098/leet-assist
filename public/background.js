import { fetchData } from "./backgroundHelpers/fetchData";
import { sendDataToApp } from "./backgroundHelpers/sendDataToApp";
import { getErrorMessage } from "./backgroundHelpers/errorMessage";

console.log("Background service worker loaded");

const allowedHost = "leetcode.com";
const allowedPathPrefix = "/problems/";

// Listen for extension icon click : 
// Handle extension icon click

chrome.action.onClicked.addListener(async (tab) => {

  if (!chrome.sidePanel) {
    console.error("❌ chrome.sidePanel API is not available. Update Chrome to v114+.");
    return;
  }

  if (!tab.url) return;

  const url = new URL(tab.url);

  // Only allow on LeetCode problems
  if (url.hostname === allowedHost && url.pathname.startsWith(allowedPathPrefix))  {
    await chrome.sidePanel.open({ tabId: tab.id });

  } else {
    // Optional: show feedback if clicked on wrong site
    console.log("Side panel not available on this site:", url.hostname);
  }

  return true;
});



// Always register the message listener globally
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "PANEL_LOADED") {
    console.log("Side panel has mounted successfully!");
    sendResponse({ status: "acknowledged" });
    return true; // keep the message channel open until sendResponse runs
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "QUESTION_URL") {
    const url = message.url;
    console.log("📩 Received URL from content.js:", url);

    // Save the latest URL in chrome.storage
    chrome.storage.local.set({ latestQuestionUrl: url }, () => {
      console.log("✅ URL saved in storage:", url);
    });

    // Make the API call
    fetchData(url)
      .then((data) => {
        console.log("✅ Response from AI:", data);

        // Send this data to the Pop-up UI
        sendDataToApp(data);

        // Respond back to the content script only after async is done
        sendResponse({ received: true });
      })
      .catch((err) => {
        console.error("❌ Error in fetchData:", err);
        const errResponse= getErrorMessage(err);
        sendDataToApp({"error" : errResponse});
        sendResponse({ received: false, error: String(err) });
      });

    // IMPORTANT: keep the channel open for async sendResponse
    return true;
  }
});
