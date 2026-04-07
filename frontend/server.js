import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const server = http.createServer(async (req, res) => {
  try {    const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = path.join(__dirname, requestPath);
    const extension = path.extname(filePath);
    const contentType = mimeTypes[extension] || "text/plain; charset=utf-8";

    const fileContents = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(fileContents);
  } catch {
    try {
      const fallback = await readFile(path.join(__dirname, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fallback);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Frontend server error: ${error.message}`);
    }
  }
});

server.listen(port, () => {
  console.log(`Frontend running on http://localhost:${port}`);
});
