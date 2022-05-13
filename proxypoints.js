module.exports = function (router) {
    middles.forEach((m) => {
        router.get("/:host/feed", m);
    });
};
const proxy = require("koa-proxies");
const proxyurlsprefixs = require("./proxyurlsprefixs");

const middles = proxyurlsprefixs.map((host) => {
    return async (ctx, next) => {
        if (!ctx.req.url.startsWith("/" + host + "/" + "feed")) {
            return next();
        }
        const promid = proxy("/", {
            events: {
                proxyRes(proxyRes, req, res) {
                    proxyRes.headers["cache-control"] = "max-age=300";
                },
            },
            followRedirects: true,
            changeOrigin: true,
            logs: true,
            target: "https://" + host,
            rewrite(path) {
                const p = path.replace(host, "").replace("//", "/");
                return p;
            },
        });
        return promid(ctx, next);
    };
});
