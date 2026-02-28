const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

async function getSafeFilePath(frontendRoot, relativePath) {
  const normalizedPath = path.normalize(relativePath).replace(/^([.]{2}[/\\])+/, "");
  const absolutePath = path.resolve(frontendRoot, normalizedPath);

  if (!absolutePath.startsWith(frontendRoot)) {
    return null;
  }

  try {
    const stats = await fsPromises.stat(absolutePath);
    if (!stats.isFile()) {
      return null;
    }

    return absolutePath;
  } catch {
    return null;
  }
}

function sendFile(reply, filePath) {
  const extension = path.extname(filePath);
  const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

  reply.type(contentType);
  reply.send(fs.createReadStream(filePath));
}

async function serveFrontendAssetsPlugin(fastify) {
  const frontendRoot = path.resolve(__dirname, "../../../frontend/public");
  const indexPath = path.resolve(frontendRoot, "index.html");

  fastify.get("/", async (_request, reply) => {
    sendFile(reply, indexPath);
  });

  fastify.get("/*", async (request, reply) => {
    if (request.url.startsWith("/v1/")) {
      reply.callNotFound();
      return;
    }

    const wildcardPath = request.params["*"] || "index.html";
    const filePath = await getSafeFilePath(frontendRoot, wildcardPath);

    if (filePath) {
      sendFile(reply, filePath);
      return;
    }

    sendFile(reply, indexPath);
  });
}

module.exports = serveFrontendAssetsPlugin;
