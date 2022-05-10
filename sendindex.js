const sendFile = require("koa-sendfile");
const path = require("path");

function sendindex() {
    return async (ctx) => {
        await sendFile(ctx, path.join(__dirname, "public", "index.html"));
    };
}
exports.sendindex = sendindex;
