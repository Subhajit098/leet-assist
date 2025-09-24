export function sendDataToApp(data) {
  chrome.runtime.sendMessage(
    {
      type: "DATA_FROM_BACKGROUND_TO_APP",
      payload: data,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.warn("sendDataToApp lastError:", chrome.runtime.lastError.message);
        return;
      }
      if (response && response.received) {
        console.log("Data is received by App.jsx (confirmed).");
      } else {
        console.log("App.jsx did not confirm receipt:", response);
      }
    }
  );
}