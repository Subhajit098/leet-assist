import React, { useEffect, useState } from "react";

function App() {


  // const [url, setUrl] = useState(null); 


  // useEffect(() => {
  //   // 1. Read the latest URL when popup loads
  //   chrome.storage.local.get("latestQuestionUrl", (result) => {
  //     if (result.latestQuestionUrl) {
  //       console.log("📂 Loaded from storage:", result.latestQuestionUrl);
  //       setUrl(result.latestQuestionUrl);
  //     }
  //   });

  //   // 2. Listen for storage changes (if new URL is stored)
  //   function handleStorageChange(changes, areaName) {
  //     if (areaName === "local" && changes.latestQuestionUrl) {
  //       console.log("🔄 Storage updated:", changes.latestQuestionUrl.newValue);
  //       setUrl(changes.latestQuestionUrl.newValue);
  //     }
  //   }

  //   chrome.storage.onChanged.addListener(handleStorageChange);
  // }, [url]);

  // console.log("URL : ",url)


  const [dataFromBg,setDataFromBg] = useState('');

  useEffect(()=>{
    const handleMessageFromBg=(message,sender,sendResponse)=>{
      if(message.type === "DATA_FROM_BACKGROUND_TO_APP"){
        setDataFromBg(message.payload);
        sendResponse({"received" : true});
      }
    }

    
    // receive the API data from the background.js
    chrome.runtime.onMessage.addListener(handleMessageFromBg);
    
    console.log("Data is received from the Background.js", dataFromBg);
  })

  return (
    <div style={{ padding: "1rem", width: "280px" }}>
      <h2>🚀 LeetCode Buddy</h2>

      {/* Button to trigger injection of content.js and fetch URL */}
      <button >See hints !</button>


    </div>
  );
}

export default App;
