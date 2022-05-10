const Koa = require("koa");
const KoaRouter = require("koa-router");

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
const { createsslify } = require("./createsslify");
const { setcache } = require("./setcache");
const { AccessControlAllowOrigin } = require("./AccessControlAllowOrigin");
const { sendindex } = require("./sendindex");
const { identity } = require("./identity");
const { httpssecure } = require("./httpssecure");
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
proxypoints(router);

router.get("/", sendindex());

app.use(router.allowedMethods());
app.use(router.routes());

app.use(koastatic(path.join(__dirname, "public"), { hidden: true }));

module.exports = app;
