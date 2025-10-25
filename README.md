# Termux-File-Share
A simple, lightweight file server built with Node.js and Express specifically for the Termux environment. It allows you to access and download all files from your device's /storage/shared folder (internal storage/SD card) directly through a web browser on your local Wi-Fi network.
Here’s a clean and professional README.md for your Termux Wi-Fi file server 👇


---

# 📁 Termux File Share Server

A lightweight **Wi-Fi file server** built with **Express.js** for Termux and Android.  
It allows you to browse, download, and share files from your device storage directly over the local network.

---

## 🚀 Features
- 📂 Browse internal storage folders via web browser
- 📸 Displays directories in a clean HTML list format
- ⬇️ Download any file instantly through Wi-Fi
- 🌐 Works on your local network (accessible via IP)
- 🪶 Zero dependencies besides Node.js built-ins
- 🔒 Private — only accessible on your network

---

## 🛠️ Requirements
- **Termux** (latest version)
- **Node.js** installed via:
  ```bash
  pkg install nodejs

Storage permission granted in Termux:

termux-setup-storage



---

📦 Installation

1. Clone or copy this repository into your Termux home folder:

git clone https://github.com/Griffin256/Termux-File-Share.git
cd Termux-File-Share


2. Start the server:

node server.js

(Assuming your file is named server.js)




---

⚙️ Configuration

By default, the root directory exposed is:

/data/data/com.termux/files/home/storage/shared

This corresponds to your phone’s internal shared storage.

You can modify this line to change the folder being shared:

const ROOT_DIR = "/data/data/com.termux/files/home/storage/shared";

The server listens on:

HOST = "0.0.0.0";
PORT = 3000;


---

📡 Accessing the Server

Once started, Termux will display a line like:

🚀 File server running at http://192.168.1.5:3000

Open that address in any browser on the same Wi-Fi network to access your files.


---

🧩 How It Works

Uses Express.js to create a simple HTTP server.

Lists files and folders from your selected directory.

Automatically serves files with download headers.

Detects your local IP using Node’s os.networkInterfaces().



---

🔒 Security Note

This tool is designed for personal/local use only.
Avoid running it on public networks or without password protection.


---

🧠 Credits

Public Software by GRIPAL Tech
Developed and maintained by @Griffin256


---

🪪 License

This project is open-source under the MIT License. Feel free to modify and distribute with attribution.
