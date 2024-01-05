import * as _api from "./api";

import { createServer } from "http";

type Fns = {
  [K in string]?: ((...params: any) => unknown) | Fns;
};
const api: Fns = _api;

const port = 8888;
const base = `http://localhost:${port}`;

const server = createServer((req, res) => {
  console.log(req.url);
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
  } else if (
    !req.headers["content-type"]?.toLowerCase().includes("application/json")
  ) {
    res.statusCode = 415;
    res.end();
  } else if (!req.url || !req.url.startsWith("/api/")) {
    res.statusCode = 404;
    res.end();
  } else {
    const pathname = new URL(req.url, base).pathname;
    const fn = pathname
      .split("/")
      .slice(2)
      .reduce((prev, curr) => (prev as any)?.[curr], api);
    if (typeof fn !== "function") {
      res.statusCode = 404;
      res.end();
    } else {
      let chunks: any[] = [];
      req.on("readable", () => {
        let chunk;
        while (null !== (chunk = req.read())) {
          chunks.push(chunk);
        }
      });
      req.on("end", () => {
        const content = chunks.join("");
        const send = (code: number, data: object) => {
          const body = JSON.stringify(data);
          res
            .writeHead(code, {
              "Content-Length": Buffer.byteLength(body),
              "Content-Type": "application/json",
            })
            .end(body);
        };
        try {
          const params = JSON.parse(content);
          console.log(fn, params);
          Promise.resolve((fn as any)(...params)).then(
            (data) => {
              send(200, data);
            },
            (error) => {
              send(500, { message: String(error) });
            }
          );
        } catch (error) {
          send(400, {
            message: {
              params: content,
              error: String(error),
            },
          });
        }
      });
    }
  }
});

server.listen(8888);
console.log(base);
