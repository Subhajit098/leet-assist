# 🚀 Leet Assist – Chrome Extension

A **React + Vite Chrome Extension** powered by the **OpenAI API** that helps you solve **LeetCode problems** by providing step-by-step hints without spoiling the full solution.

---

## ✨ Features
- 🔍 **Context-aware hints** guided hints instead of full solutions. 
- 🤖 **AI-powered** using the OpenAI API.
- 🎯 **Popup UI** built with React, Vite & Material UI. 
- 📌 **Sticky window** – stays open while you navigate between problems.  
- 🛠 Easy to install and run locally.

---

## 🏗 Project Structure
```
├── public/
│ ├── manifest.json # Chrome Extension manifest v3
│ └── icons/ # Extension icons
├── src/
│ ├── background.js # Background service worker
│ ├── content.js # Content script injected into LeetCode
│ ├── App.jsx # Main React popup component
│ ├── main.jsx # Vite + React entry
│ └── styles/ # Styling
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation (Developer / Local)

> These steps are for loading the extension locally during development.

1. Clone or copy the extension source into a directory on your machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right).
4. Click **Load unpacked**, then select the extension directory (the folder containing `manifest.json`).
5. The extension should appear in the toolbar. If the icon is hidden, click the puzzle icon and pin it for easy access.

---

## Usage

1. Open any LeetCode problem page (for example: `https://leetcode.com/problems/two-sum/`).
2. Click the extension icon (it uses an icon-only button) to open the hints panel.
3. Use the provided buttons inside the panel to cycle through hint levels.
4. Hints are stored in the extension or injected from the page (depends on your implementation). No external calls are required unless you explicitly add a server integration.

---

## Privacy & Data

* By default the extension does not send any problem data or user data to external servers.
* If you add a server-side feature (for syncing hints, analytics, etc.), clearly document what data is sent and provide an opt-in.

---

## Troubleshooting

* **Panel not showing**: Make sure the content script `matches` pattern includes the exact URL format of LeetCode problems.
* **Styles conflict**: Increase specificity or wrap the panel in a unique root node (e.g., `#lc-hints-root`) to avoid overriding site CSS.
* **Permissions error**: Verify `manifest_version` is 3 and your `host_permissions` include the LeetCode domain.

---