export function sendDataToApp(data){

    // use the chrome runtime to start a communication
    chrome.runtime.sendMessage({
        type : "DATA_FROM_BACKGROUND_TO_APP",
        payload : data
    },(response)=>{
        if(response && response.received){
            console.log("Data is received from Background.js to App.jsx ---> confirmed by App.jsx")
        } else {
            console.log("Not able to receive the data from background.js ---> responded by App.js")
        }
    })

}