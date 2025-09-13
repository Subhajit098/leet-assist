(function () {
  console.log("📥 Fetching current LeetCode URL...");

  const url = window.location.href;

  chrome.runtime.sendMessage(
    {
      type: "QUESTION_URL",
      url
    },
    (response) => {
      if (response && response.received) {
        console.log("✅ Response is received from background.js");
      } else {
        console.log("❌ Response is not received from background.js");
      }
    }
  );

  console.log("✅ Sent URL:", url);
})();
