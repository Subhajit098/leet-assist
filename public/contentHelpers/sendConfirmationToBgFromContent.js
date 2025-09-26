// sendConfirmationToBgFromContent.js
export function sendConfirmationToBgFromContent() {
  console.log("📥 Fetching current LeetCode URL...");

  const url = new URL(window.location.href);

  // check if the URL is belonging to any Leetcode problem page : 
  console.log("URL name : " ,url);

  chrome.runtime.sendMessage(
    {
      type: "QUESTION_URL",
      url: url.href,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn("sendConfirmationToBgFromContent lastError:", chrome.runtime.lastError.message);
        return;
      }
      if (response && response.received) {
        console.log("✅ Response is received from background.js");
      } else {
        console.log("❌ Response is not received from background.js or response is falsy:", response);
      }
    }
  );

  console.log("✅ Sent URL:", url);
}