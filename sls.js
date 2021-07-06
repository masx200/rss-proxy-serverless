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

const koastatic = require("koa-static");
const app = new Koa();

app.use(logger());
const router = new KoaRouter();
const { default: sslify } = require("koa-sslify");
if (process.env.SERVERLESS) {
    app.use(createsslify());
}
app.use(setcache());
app.use(httpssecure());
app.use(range);
app.use(AccessControlAllowOrigin());
app.use(cors({}));
app.use(conditional());
if (process.env.SERVERLESS) {
    app.use(identity());
}
app.use(compress({}));

app.use(koastreametag({}));
app.use(koaetag({}));
proxypoints(app);

router.get("/", sendindex());
/*router.get("/testreq", async (ctx, next) => {
    const { method, url, headers } = ctx.req;
    ctx.body = { method, url, headers };
});*/
app.use(router.allowedMethods());
app.use(router.routes());

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

function setcache() {
    return async (ctx, next) => {
        ctx.res.setHeader("cache-control", "max-age=120");
        return next();
    };
}

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

function identity() {
    return async (ctx, next) => {
        ctx.req.headers["accept-encoding"] = "identity";
        return next();
    };
}

function sendindex() {
    return async (ctx) => {
        await sendFile(ctx, path.join(__dirname, "public", "index.html"));
    };
}

function AccessControlAllowOrigin() {
    return async (ctx, next) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        return next();
    };
}
app.use(koastatic(path.join(__dirname, "public"), { hidden: true }));

module.exports = app;
