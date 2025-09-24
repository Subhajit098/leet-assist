export async function getLastUrl() {
  try {
    const result = await chrome.storage.local.get(["latestQuestionUrl"]);
    const lastUrl = result.latestQuestionUrl || null;
    console.log("Last stored URL:", lastUrl);
    return lastUrl;
  } catch (err) {
    console.error("Error reading from storage:", err);
    return null;
  }
}