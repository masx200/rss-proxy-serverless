function setcache() {
    return async (ctx, next) => {
        ctx.res.setHeader("cache-control", "max-age=120");
        return next();
    };
}
exports.setcache = setcache;
