# 📌 Save Link Chrome Extension

Save and manage bookmarks effortlessly using a Chrome Extension with JSONBin as the backend.

![Save link screenshot](./images//Save%20link%20chrome%20extension%20screenshot.png)

## 🚀 Overview

This Chrome extension allows users to **save and remove bookmarks**, storing them in a **JSON file hosted on [JSONBin.io](https://jsonbin.io/)**.

The extension does **not** store any data itself; instead, it uses **Chrome's local storage** to persist the API key and database URL for accessing JSONBin.

## 🎯 Purpose

I created this extension to make bookmark management seamless across different devices. By saving bookmarks to JSONBin, I can easily retrieve them on my personal website/portfolio, enabling quick access to saved links from anywhere.

## 🔧 Features

✅ **Add bookmarks**: Save the current tab's URL to JSONBin  
✅ **Remove bookmarks**: Delete saved URLs from JSONBin  
✅ **Persistent storage**: Chrome's local storage is used for API keys and database URLs  
✅ **Secure**: No external server; all data is stored in JSONBin

## 🛠️ Technologies Used

- **JavaScript/TypeScript** – Ensures better code maintainability
- **Chrome Extensions API** – Used for interacting with tabs and storage
- **JSONBin.io** – Acts as a simple cloud-based database for storing bookmarks
- **HTML/CSS** – For the extension’s popup UI
- **Rollup** - Used to bundle and generate optimized `dist` files

## 💡 Why I Chose JSONBin

I chose **JSONBin** for the following reasons:

1. **Free Tier**: JSONBin offers a **generous free tier** with **10,000 requests per month**, making it a great option for small to medium-sized projects without the need for additional costs.
2. **Ease of Use**: JSONBin is incredibly simple to set up and interact with, making it a convenient choice for a quick and lightweight backend solution.

However, in case you prefer to use a different database or storage solution, you will need to modify the extension's code. Specifically:

- The **fetching and saving of bookmarks** is tailored to **JSONBin's response format**.
- To integrate a different storage solution, you would need to update the code to handle the new API format and endpoints accordingly.

Feel free to explore other database options, but be aware that this will require code adjustments for compatibility.

## 📦 Installation

1. **Clone the repository**

```sh
   git clone https://github.com/Liouch/save-link-chrome-extension.git
   cd save-link-chrome-extension
```

2. **Install dependencies**

```sh
npm install
```

3. **Build the extension**

```sh
npm run build
```

4. **Load the extension in Chrome**
   - Open **Chrome** and go to chrome://extensions/
   - Enable **Developer Mode** (top-right corner)
   - Click **Load unpacked** and select the dist/ folder

## 🔑 Setup API Key & Database URL

Since this extension does **not store bookmarks directly**, you need a JSONBin account:

1. **Create a JSONBin account** at [jsonbin.io](https://jsonbin.io/)
2. **Create a new bin** and copy its API URL
3. **Store the API Key & URL in Chrome Storage**:
   - Open the extension popup
   - Enter the API Key and JSONBin URL in the settings

## 🎯 Usage

- **Click the extension icon** to open the popup
- **Click "Save Bookmark"** to store the current tab
- **Click "Remove Bookmark"** to delete a saved link
- The extension will **sync with JSONBin** in real time

## 📬 Contact

For questions, suggestions, or collaboration, feel free to reach out:

👤 **Liou Wang**  
📧 Email: [liou.wang.it@gmail.com](mailto:liou.wang.it@gmail.com)  
🔗 LinkedIn: [linkedin.com/in/liou-wang-/](https://www.linkedin.com/in/liou-wang-/)  
💻 GitHub: [github.com/Liouch](https://github.com/Liouch)

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](/license.txt) file for details.
