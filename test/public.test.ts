//@ts-ignore
import app from "../sls.js";
import { assert, test } from "vitest";
import { fetch } from "undici";
import http from "http";
import fs from "fs";
import { extname } from "path";
test("public", async () => {
    const extension_to_type = new Map<string, string>([
        [".css", "text/css"],
        [".html", "text/html"],
    ]);
    const files = await fs.promises.readdir(
        new URL("../public/", import.meta.url)
    );
    console.log(files);
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
        files.map(async (file) => {
            const url = `http://localhost:${port}/${file}`;

            const response = await fetch(url);
            console.log(url);
            console.log(response);
            assert(response.ok);
            const content_type = response.headers.get("content-type");
            assert(content_type);
            const expected_type = extension_to_type.get(extname(url));
            assert(expected_type);
            assert([expected_type].some((t) => content_type.startsWith(t)));
            const text = await response.text();
            assert(text.length > 0);
        })
    );
    server.close();
}, 10000);
