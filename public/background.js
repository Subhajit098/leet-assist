import { fetchData } from './utils/apiCall.js';
import { sendDataToApp } from './utils/sendDataToApp.js';

console.log("Background service worker loaded");

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
        sendResponse({ received: false, error: String(err) });
      });

    // IMPORTANT: keep the channel open for async sendResponse
    return true;
  }
});
