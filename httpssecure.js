function httpssecure() {
    return async (ctx, next) => {
        ctx.res.setHeader("Strict-Transport-Security", "max-age=31536000");
        ctx.res.setHeader(
            "Content-Security-Policy",
            "upgrade-insecure-requests"
        );
        return next();
    };
}
exports.httpssecure = httpssecure;
