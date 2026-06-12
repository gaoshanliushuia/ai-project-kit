import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { createDemoApp } from "./app.mjs";

const app = createDemoApp();
const root = fileURLToPath(new URL("..", import.meta.url));
const frontendRoot = join(root, "frontend");
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(response, payload, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function currentUser(request) {
  const roleCode = request.headers["x-role-code"] || "academic_admin";
  const teacherId = Number(request.headers["x-teacher-id"] || 1);
  const classId = Number(request.headers["x-class-id"] || 1);
  return { roleCode, teacherId, classId };
}

function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://localhost:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(frontendRoot, safePath);

  if (!filePath.startsWith(frontendRoot) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
    return;
  }

  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://localhost:${port}`);

  try {
    if (request.method === "GET" && url.pathname === "/api/auth/profile") {
      sendJson(response, app.getProfile(url.searchParams.get("username") || "academic_admin"));
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/students") {
      sendJson(response, app.listStudents(currentUser(request), Object.fromEntries(url.searchParams)));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/students") {
      sendJson(response, app.createStudent(currentUser(request), await parseBody(request)));
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/scores") {
      sendJson(response, app.listScores(currentUser(request)));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/scores") {
      sendJson(response, app.createScore(currentUser(request), await parseBody(request)));
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    sendJson(response, { success: false, code: "INTERNAL_ERROR", message: error.message, data: null }, 500);
  }
});

server.listen(port, () => {
  console.log(`School education runnable example: http://localhost:${port}`);
});
