const Koa = require("koa");
const KoaRouter = require("koa-router");
const sendFile = require("koa-sendfile");
const logger = require("koa-logger");
const path = require("path");
const compress = require("koa-compress");
const cors = require("@koa/cors");
const conditional = require("koa-conditional-get");
const koaetag = require("koa-etag");
const http = require("http");
const app = new Koa();
const router = new KoaRouter();
app.use(logger());
app.use(AccessControlAllowOrigin());
app.use(cors({}));
app.use(conditional());

app.use(compress({}));

app.use(koaetag({}));
// Routes
router.get("/", async (ctx) => {
    await sendFile(ctx, path.join(__dirname, "index.html"));
});

app.use(router.allowedMethods());
app.use(router.routes());

// don't forget to export!
// module.exports = app;
function AccessControlAllowOrigin() {
    return async (ctx, next) => {
        ctx.response.set("Access-Control-Allow-Origin", "*");
        return next();
    };
}

if (process.env.SERVERLESS) {
    module.exports = app;
} else {
    const server = http.createServer(app.callback());

    server.on("listening", () => {
        console.log(`Server listening on ` + JSON.stringify(server.address()));
    });
    server.listen(3000);
}
