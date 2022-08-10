const app = require("./app");
const http = require("http");
const { PORT, URI } = require("./utils/config");
const { info, error } = require("./utils/logger");

const server = http.createServer(app);

server.listen(PORT, () => {
  info("server running on port", PORT);
});
