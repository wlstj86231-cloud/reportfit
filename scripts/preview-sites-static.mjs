import { createServer } from "node:http";

const worker = (await import("../dist/server/index.js")).default;
const port = Number(process.env.REPORTOOLS_PREVIEW_PORT || 8795);

createServer(async (request, response) => {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (value) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  const result = await worker.fetch(new Request(`http://127.0.0.1:${port}${request.url}`, {
    method: request.method,
    headers,
  }));
  response.writeHead(result.status, Object.fromEntries(result.headers));
  response.end(Buffer.from(await result.arrayBuffer()));
}).listen(port, "127.0.0.1", () => {
  console.log(`reportools Sites preview: http://127.0.0.1:${port}`);
});
