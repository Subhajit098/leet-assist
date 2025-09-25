// sendConfirmationToBgFromContent.js
export function sendConfirmationToBgFromContent() {
  console.log("📥 Fetching current LeetCode URL...");

  const url = window.location.href;

  chrome.runtime.sendMessage(
    {
      type: "QUESTION_URL",
      url,
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