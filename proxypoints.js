const proxy = require("koa-proxies");
const proxyurlsprefixs = ["www.landiannews.com","www.tmtpost.com", "www.iplaysoft.com"];
module.exports = function (app) {
    middles.forEach((m) => {
        app.use(m);
    });
};
const middles = proxyurlsprefixs.map((host) => {
    return async (ctx, next) => {
        if (!ctx.req.url.startsWith("/" + host + "/")) {
            return next();
        }
        const promid = proxy("/", {
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
