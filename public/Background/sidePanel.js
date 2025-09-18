// background/openSidePanel.js
export async function sidePanel() {
  try {
    await chrome.sidePanel.setOptions({
      path: "index.html", // React app entry
    });
    console.log("Side panel opened!");
  } catch (error) {
    console.error("Failed to open side panel:", error);
  }
}
