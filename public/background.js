console.log("Background service worker loaded");
let url;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "QUESTION_URL") {
    url=message.url
    console.log("📩 Received URL from content.js:", message.url);



    // Respond back to the content script
    sendResponse({ received: true });

 
    // Save the latest URL in chrome.storage
    chrome.storage.local.set({ latestQuestionUrl: message.url }, () => {
      console.log("✅ URL saved in storage:", message.url);
    });


    // Keep the message channel open (safe practice in MV3)
    return true;
  }

  
});



