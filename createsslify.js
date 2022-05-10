const { default: sslify } = require("koa-sslify");

function createsslify() {
    return sslify({
        resolver: (ctx) => {
            if (!ctx.request.header["x-api-scheme"]) {
                return true;
            }
            return ctx.request.header["x-api-scheme"] === "https";
        },
    });
}
exports.createsslify = createsslify;
