export const sendConfirmationToContentFromApp = () => {
    chrome.runtime.sendMessage(
      { type: "CONFIRMATION_FROM_APP_TO_CONTENT" },
      (response) => {

        // handling if the message didn't reach the content
        if(response && response.status)
          console.log("Response from Content:", response.status);

        else {
          console.log("Response didn't react to Content.js !")
        }
      }
    );
  };