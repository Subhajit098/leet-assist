// import { fetchData } from './utils/apiCall.js';
// import { sendDataToApp } from './utils/sendDataToApp.js';

import OpenAI from "openai";

const apiKey = import.meta.env.VITE_API_KEY2; // careful with this in extensions!

const client = new OpenAI({
  apiKey: apiKey,
//   dangerouslyAllowBrowser: true // required when calling from browser/extension
});

// async function fetchData(url) {
//   try {
//     const response = await client.responses.create({
//       model: "gpt-4.1-nano-2025-04-14",
//       input: `Please give me all the proper hints for this leetcode question having URL : ${url} in plain text point wise (seperated by ** in one stretch i.e., in a full paragraph) in a JSON format, which covers all the techniques and methods needed to solve this question. No need to mention any extra word or line apart from the hints. I don't want answers like "here is the answers..." . Make it very clear like starting from first hint from ** then ** and continue to the next hints and then ultimately when the hints are finished , casually closing it with ** again. No extra texts of your greeting is needed just the answer `
//     });

//     // Safely return the text content
//     return response.output[0].content[0].text;
//   } catch (err) {
//     console.error("Error in fetchData:", err);
//     throw err;
//   }
// }


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
