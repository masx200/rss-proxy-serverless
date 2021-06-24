const proxy = require("koa-proxies");
module.exports = [
    {
        method: "get",
        path: "/www.tmtpost.com/rss",
        middleware: proxy("/", {
            changeOrigin: true,
            logs: true,
            target: "https://www.tmtpost.com/rss",
        }),
    },
];
