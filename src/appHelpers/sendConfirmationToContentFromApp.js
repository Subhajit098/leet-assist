
// using the tabs.query approach
export const sendConfirmationToContentFromApp = () => {
  return new Promise((resolve,reject)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.warn("⚠️ No active tab found");
        return reject({
          success: false,
          error: "No Active tab found !",
        })
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
            console.error("❌ Could not inject content script:", chrome.runtime.lastError.message);
            return reject({
              success: false,
              error: "Leet Assist extension is not available on this website !",
            })
          }

          chrome.tabs.sendMessage(
            activeTabId,
            { type: "CONFIRMATION_FROM_APP_TO_CONTENT" },
            (response) => {
              if (chrome.runtime.lastError) {
                console.warn("❌ Error sending to content:", chrome.runtime.lastError.message);
                return reject({
                  success: false,
                  error: `Error sending to content : ${chrome.runtime.lastError.message}`
                })
              }

              if (response && response.status) {
                console.log("✅ Response from Content:", response.status);
                return resolve({
                  success: true,
                  message: response.status,
                })
              } else {
                console.log("❌ Response didn't reach Content.js!");
                reject({
                  success: false,
                  error: "No response from Content.js",
                })
              }
            }
          );
        }
      ); 
    });
  })

};