const app = require("./sls.js");
const http = require("http");

const server = http.createServer(app.callback());

server.on("listening", () => {
    console.log(`Server listening on ` + JSON.stringify(server.address()));
});
server.listen(3500);
