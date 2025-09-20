// import { fetchData } from './utils/apiCall.js';
// import { sendDataToApp } from './utils/sendDataToApp.js';

import OpenAI from "openai";

const apiKey = import.meta.env.VITE_API_KEY2; // careful with this in extensions!

const client = new OpenAI({
  apiKey: apiKey,
//   dangerouslyAllowBrowser: true // required when calling from browser/extension
});



async function fetchData(url) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [
        {
          role: "system",
          content: "You are a JSON-only API. Always return valid JSON that matches the schema."
        },
        {
          role: "user",
          content: `Provide clear step-by-step hints to solve the LeetCode problem at this URL: ${url}. 
Each hint should be a separate string in the array.`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "LeetCodeHints",   // ✅ required
          schema: {                // ✅ required (not json_schema)
            type: "object",
            properties: {
              hints: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["hints"],
            additionalProperties: false
          }
        }
      },
      temperature: 0
    });

    if (response.output_parsed) {
      return response.output_parsed;
    }

    // Parsed JSON is available directly here
     return JSON.parse(response.output_text);

  } catch (err) {
    console.error("Error in fetchData:", err);
    throw err;
  }
}



function sendDataToApp(data) {
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
});


// Listen for tab changes so the side panel can be unmounted automatically
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);
  console.log("User switched to tab:", tab.url);

  let url="";
  if(tab.url && tab.url.startsWith("https"))
    url = new URL(tab.url);
  if (!url || !(url.hostname === allowedHost && url.pathname.startsWith("/problems"))) {
    await chrome.sidePanel.setOptions({ tabId, enabled: false });

    // Sending message to the App.jsx to close the side panel
    chrome.runtime.sendMessage({ type: "close-sidepanel", tabId }).catch(() => {
        // Safe to ignore if no side panel is open
    });
  } 
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
        sendResponse({ received: false, error: String(err) });
      });

    // IMPORTANT: keep the channel open for async sendResponse
    return true;
  }
});
