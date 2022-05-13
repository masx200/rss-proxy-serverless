//@ts-ignore
import proxyurlsprefixs from "../proxyurlsprefixs.js";
//@ts-ignore
import app from "../sls.js";
import { assert, test } from "vitest";
import { fetch } from "undici";
import http from "http";
test("feed", async () => {
    const server = http.createServer(app.callback());
    const port = await new Promise<number>((resolve, reject) => {
        server.on("error", reject);
        server.listen(() => {
            //@ts-ignore
            const port = server.address()?.port as number;
            port ? resolve(port) : reject(Error(""));
        });
    });

    await Promise.all(
        //@ts-ignore
        proxyurlsprefixs.map(async (prefix) => {
            const url = `http://localhost:${port}/${prefix}/feed`;

            const response = await fetch(url);
            console.log(url);
            console.log(response);
            assert(response.ok);
            const content_type = response.headers.get("content-type");
            assert(content_type);
            assert(
                ["text/xml", "application/rss+xml"].some((t) =>
                    content_type.startsWith(t)
                )
            );
            const text = await response.text();
            assert(text.length > 0);
        })
    );
    server.close();
}, 10000);
