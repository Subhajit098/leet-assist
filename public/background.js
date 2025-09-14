import OpenAI from "openai";
const client = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY
});
import {fetchData} from './utils/apiCall.js'
import {sendDataToApp} from './utils/sendDataToApp.js'


// for testing purposes and to track the responses from API
let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();
// console.log(`The current time is: ${hours}:${minutes}:${seconds}`);

console.log("Background service worker loaded");
let url;
let DATA_FROM_API;
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
      console.log(`Response from AI at time - ${hours} hours,${minutes} minutes,${seconds} seconds : ${data}`);

      // send this data to the Pop UP UI (or App.jsx)
      DATA_FROM_API=data;
      sendDataToApp(DATA_FROM_API);
    })
    .catch((err) => {
      console.log("Some error occurred:", err);
    });



    // Keep the message channel open (safe practice in MV3)
    return true;
  }

  
});



