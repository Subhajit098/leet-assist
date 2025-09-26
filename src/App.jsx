// App.jsx
import React, { useEffect, useReducer, useState } from "react";
import HintPagination from "./components/HintPagination.jsx";
import "./styles/App.css"
import { sendConfirmationToContentFromApp } from "./appHelpers/sendConfirmationToContentFromApp.js";
import { Container, AppBar, Toolbar, Typography, Box } from "@mui/material";
import ErrorAlert from "./components/ErrorAlert.jsx";
ErrorAlert;
import FetchingHints from "./components/static/FetchingHints.jsx";
import ClickTheButtonToFetchHints from "./components/static/ClickTheButtonToFetchHints.jsx";
import Footer from "./components/static/Footer.jsx";
import AppHeading from "./components/static/AppHeading.jsx";
import DarkModeToggle from "./components/static/DarkModeToggle.jsx";


function App() {

  const initialState = {
    clicked: false,
    dataFromBg: [],
    error: null,
  };

  function apiReducer(state, action) {
    switch (action.type) {
      case "FETCH_START":
        return { clicked: true, dataFromBg: [], error: null };
      case "FETCH_SUCCESS":
        return { clicked: false, dataFromBg: action.payload, error: null };
      case "FETCH_ERROR":
        return { clicked: false, dataFromBg: null, error: action.payload };
      case "RESET_VALUE":
        return initialState;
      default:
        return state;
    }
  }


  const [state, dispatch] = useReducer(apiReducer, initialState);


  const handleSeeHints = () => {
    // Trigger the message to content.js
    sendConfirmationToContentFromApp()
    .then((res)=>{
      console.log("Success : ",res.message);

      // Update the state
      dispatch({ type: "FETCH_START" });
    })
    .catch((err)=>{
      console.log("Error : ",err.error);
      alert(err.error);
    })
    
    return ;
  };


  useEffect(() => {
    // Helper to get tab info as a promise
    const getTab = (tabId) =>
      new Promise((resolve, reject) => {
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(tab);
        });
      });

    // Called whenever active tab changes
    const handleTabActivated = async ({ tabId }) => {
      try {
        const tab = await getTab(tabId);
        console.log("Tab switched to:", tab.url);

        // Update the state
        dispatch({ type: "RESET_VALUE" });
      } catch (err) {
        console.error("Error getting tab info:", err.message);
      }
    };

    // Called whenever tab URL updates
    const handleTabUpdated = (tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        const newQUrl = changeInfo.url;
        chrome.storage.local.get(["latestQuestionUrl"], (result) => {
          const lastQUrl = result.latestQuestionUrl || null;

          // Skip if only difference is /description/
          if (
            lastQUrl &&
            ((lastQUrl + "description/") === newQUrl ||
              (newQUrl + "description/") === lastQUrl ||
              lastQUrl === newQUrl)
          ) {
            console.log("⚠️ Ignoring /description/ ↔ base mismatch");
            return;
          }

          console.log(`Tab ${tabId} navigated to: ${newQUrl}`);
          // Update the state
          dispatch({ type: "RESET_VALUE" });
        });
      }
    };

    // Message listener from background
    const handleMessageFromBg = (message, sender, sendResponse) => {

      // listen for tab changes ocurred during fetching the API result : 


      if (message?.type === "DATA_FROM_BACKGROUND_TO_APP") {
        // setDataFromBg(message.payload);

        if (message.payload?.error) {
          dispatch({ type: "FETCH_ERROR", payload: message.payload.error });
          sendResponse({ received: false });
        } else {
          dispatch({ type: "FETCH_SUCCESS", payload: message.payload });

          // send the response
          sendResponse({ received: true });
        }
      }
      return true; // for async if needed
    };

    // Attach listeners
    chrome.runtime.onMessage.addListener(handleMessageFromBg);
    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    // Cleanup on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageFromBg);
      chrome.tabs.onActivated.removeListener(handleTabActivated);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center">

        {/* App content here  */}

        <div className="parentBody">
          {/* Add the dark mode button before the heading so that it is placed at the right corner */}
            <DarkModeToggle/>

          {/* <h2>🚀 Leet Assist</h2> */}
            <AppHeading/>

          {/* Disable button if we already have hints */}
          <button onClick={handleSeeHints} disabled={state.clicked || !!state.dataFromBg?.hints?.length}>
            See hints!
          </button>

          <div className="childBody">
            {state.error ? (
              <ErrorAlert data={state.error}/>
            ) :
              state.dataFromBg?.hints ? (
                <HintPagination data={state.dataFromBg.hints} />
              ) : state.clicked ? (
                <FetchingHints/>
              ) : (
                <ClickTheButtonToFetchHints/>
              )}
          </div>

          <Footer/>

        </div>


      </Box>
    </Container>


  );

}

export default App;
