const Koa = require("koa");
const KoaRouter = require("koa-router");
const sendFile = require("koa-sendfile");
const logger = require("koa-logger");
const path = require("path");
const compress = require("koa-compress");
const cors = require("@koa/cors");
const conditional = require("koa-conditional-get");
const koaetag = require("koa-etag");
const range = require("@masx200/koa-range");
const koastreametag = require("@masx200/koa-stream-etag");
const proxypoints = require("./proxypoints.js");
const app = new Koa();
const router = new KoaRouter();

app.use(async (ctx, next) => {
    ctx.res.setHeader("Strict-Transport-Security", "max-age=31536000");
    return next();
});
app.use(range);
app.use(logger());
app.use(AccessControlAllowOrigin());
app.use(cors({}));
app.use(conditional());
if (process.env.SERVERLESS) {
    app.use(async (ctx, next) => {
        ctx.req.headers["accept-encoding"] = "identity";
        return next();
    });
}
app.use(compress({}));

app.use(koastreametag({}));
app.use(koaetag({}));
proxypoints(app);

router.get("/", async (ctx) => {
    await sendFile(ctx, path.join(__dirname, "index.html"));
});

app.use(router.allowedMethods());
app.use(router.routes());

function AccessControlAllowOrigin() {
    return async (ctx, next) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        return next();
    };
}

module.exports = app;
