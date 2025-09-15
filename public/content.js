import {sendConfirmationToBgFromContent} from "./utils/sendConfirmationToBgFromContent.js"

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message.type==="CONFIRMATION_FROM_APP_TO_CONTENT"){
      console.log("Response is received from the App.js file to the content.js file for making the API request!")

      // send confirmation to app
      sendResponse({status : "received"});
      sendConfirmationToBgFromContent();

      return true;
    }
})




