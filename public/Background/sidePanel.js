// background/sidePanel.js


// for opening the side panel
export async function sidePanel(tabId,info,tab) {
  const LEETCODE_ORIGIN="https://leetcode.com";
  if(!tab.url) return false;
  const url=new URL(tab.url);

  // ENABLE the side panel on google.com
  if(url.origin===LEETCODE_ORIGIN){

    // await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

    await chrome.sidePanel.setOptions({
      tabId,
      path : "index.html",
      enabled:true
    });

    await chrome.sidePanel.open({ tabId }); // <-- This line actually opens it
    return true;
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled : false
    })
  }

  return false;
}
