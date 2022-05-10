function identity() {
    return async (ctx, next) => {
        ctx.req.headers["accept-encoding"] = "identity";
        return next();
    };
}
exports.identity = identity;
