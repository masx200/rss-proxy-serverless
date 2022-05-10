function AccessControlAllowOrigin() {
    return async (ctx, next) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        return next();
    };
}
exports.AccessControlAllowOrigin = AccessControlAllowOrigin;
