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