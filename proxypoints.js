const proxy = require("koa-proxies");
//const stream=require("stream")
const proxyurlsprefixs = ["www.tmtpost.com"];
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
        //   return new Promise((resolve, reject) => {
        const promid = proxy("/", {
            //selfHandleResponse: true,
            //  events: {
            //  async error(err, req, res) {
            //  console.error(err);
            //  console.log("reject");
            //       reject(err);
            //      },
            //     async proxyRes(proxyRes, req, res) {
            //console.log(proxyRes.statusCode,proxyRes.headers);
            //    ctx.response.status = proxyRes.statusCode;

            //  ctx.response.set(proxyRes.headers);

            //   ctx.body = proxyRes;
            //  console.log("resolve");
            //console.log(proxyRes instanceof stream)

            //ctx.body.pipe(ctx.res)
            //      resolve();
            //  },
            //    },
            changeOrigin: true,
            logs: true,
            target: "https://" + host,
            rewrite(path) {
                // console.log(path);
                const p = path.replace(host, "").replace("//", "/");
                //console.log(p);
                return p;
            },
        });

        //  promid(ctx, next).then(resolve).catch(reject);
        //   });

        return promid(ctx, next);
    };
});
