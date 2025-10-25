const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const ROOT_DIR = "/data/data/com.termux/files/home/storage/shared";

// Serve static files (e.g., for thumbnails of images)
app.use("/_file", express.static(ROOT_DIR));

// ────────────────────────────────────────────────
// Helper: HTML renderer for folder view with thumbnails
// ────────────────────────────────────────────────
function renderDirectory(dirPath, reqPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  let html = `
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${reqPath}</title>
    <style>
      body {
        font-family: "Roboto", sans-serif;
        background: #f8f9fa;
        margin: 0;
        padding: 20px;
      }
      h1 {
        font-size: 1.2em;
        margin-bottom: 15px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
      }
      .item {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
        padding: 10px;
        overflow: hidden;
        transition: transform 0.15s;
      }
      .item:hover { transform: scale(1.03); }
      .thumb {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        margin-bottom: 8px;
        background: #e9ecef;
      }
      .name {
        font-size: 0.85em;
        color: #333;
        word-break: break-all;
      }
      a { text-decoration: none; color: inherit; }
      .back {
        display: inline-block;
        margin-bottom: 10px;
        color: #007bff;
      }
    </style>
  </head>
  <body>
    <h1>${reqPath === "/" ? "Shared Storage" : "Index of " + reqPath}</h1>
  `;

  if (reqPath !== "/") {
    const parent = path.dirname(reqPath);
    html += `<a class="back" href="${parent === "/" ? "/" : parent}">⬅ Back</a>`;
  }

  html += `<div class="grid">`;

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const webPath = path.join(reqPath, item.name);
    const isDir = item.isDirectory();
    const ext = path.extname(item.name).toLowerCase();

    let thumbSrc = "";
    if (isDir) {
      thumbSrc = "https://img.icons8.com/fluency/96/folder-invoices.png";
    } else if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) {
      thumbSrc = `/_file${webPath}`; // actual image preview
    } else if ([".mp4", ".mov", ".mkv"].includes(ext)) {
      thumbSrc = "https://img.icons8.com/fluency/96/video-file.png";
    } else if ([".mp3", ".wav", ".ogg"].includes(ext)) {
      thumbSrc = "https://img.icons8.com/fluency/96/musical-notes.png";
    } else if ([".pdf"].includes(ext)) {
      thumbSrc = "https://img.icons8.com/fluency/96/pdf.png";
    } else if ([".zip", ".rar"].includes(ext)) {
      thumbSrc = "https://img.icons8.com/fluency/96/zip.png";
    } else if ([".txt", ".doc", ".docx"].includes(ext)) {
      thumbSrc = "https://img.icons8.com/fluency/96/document.png";
    } else {
      thumbSrc = "https://img.icons8.com/fluency/96/file.png";
    }

    html += `
      <div class="item">
        <a href="${webPath}${isDir ? "/" : ""}">
          <img src="${thumbSrc}" class="thumb" loading="lazy" />
          <div class="name">${item.name}${isDir ? "/" : ""}</div>
        </a>
      </div>
    `;
  }

  html += `
    </div>
  </body>
  </html>
  `;

  return html;
}

// ────────────────────────────────────────────────
// Helper: format file size
// ────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ────────────────────────────────────────────────
// Universal route (works for Express 5+)
// ────────────────────────────────────────────────
app.use("/", (req, res) => {
  const reqPath = decodeURIComponent(req.path);
  const fsPath = path.join(ROOT_DIR, reqPath);

  if (!fs.existsSync(fsPath)) return res.status(404).send("Not found");

  const stat = fs.statSync(fsPath);
  if (stat.isDirectory()) {
    res.type("html").send(renderDirectory(fsPath, reqPath));
  } else {
    res.setHeader("Content-Length", stat.size);
    fs.createReadStream(fsPath).pipe(res);
  }
});

// ────────────────────────────────────────────────
// Start server
// ────────────────────────────────────────────────
app.listen(PORT, HOST, () => {
  console.log(`🚀 File server running at http://${getLocalIP()}:${PORT}`);
});

// ────────────────────────────────────────────────
// Helper: get local IP
// ────────────────────────────────────────────────
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const i of iface) {
      if (i.family === "IPv4" && !i.internal) return i.address;
    }
  }
  return "localhost";
}
