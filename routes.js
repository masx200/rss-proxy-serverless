const proxy = require("koa-proxies");
const proxyurlsprefixs = [{ host: "www.tmtpost.com", path: "/rss" }];
module.exports = proxyurlsprefixs.map(({ host, path }) => {
    console.log(host, path);
    return {
        method: "get",
        path: "/" + host + path,
        middleware: proxy("/", {
            changeOrigin: true,
            logs: true,
            target: "https://" + host,
            rewrite(path) {
                console.log(path);
                return path;
            },
        }),
    };
});
