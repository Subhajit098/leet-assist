
// using the tabs.query approach
export const sendConfirmationToContentFromApp = () => {
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
          alert("Please refresh the extension or try closing and reopening it !");
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