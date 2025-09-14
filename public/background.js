import OpenAI from "openai";
const client = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY
});
import {fetchData} from './utils/apiCall.js'

console.log("Background service worker loaded");
let url;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "QUESTION_URL") {
    url=message.url
    console.log("📩 Received URL from content.js at :", message.url);


    // Respond back to the content script
    sendResponse({ received: true });

 
    // Save the latest URL in chrome.storage
    chrome.storage.local.set({ latestQuestionUrl: message.url }, () => {
      console.log("✅ URL saved in storage:", message.url);
    });


    // make the API call here
    fetchData(url)
    .then((data) => {
      console.log("Response from AI:", data);
    })
    .catch((err) => {
      console.log("Some error occurred:", err);
    });



    // Keep the message channel open (safe practice in MV3)
    return true;
  }

  
});



