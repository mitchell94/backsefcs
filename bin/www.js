const http = require("http");
const kill = require("kill-port");
const app = require("../app");
const port = process.env.PORT;
const path = require("path");

kill(port);

setTimeout(() => {
  app.set("port", port);
  const server = http.createServer(app);
  server.listen(port);
  server.on("error", function () {
    console.log("Error al inicar servidor...");
  });
  server.on("listening", function () {
    console.log("Servidor ejecutandose en el puerto: " + port);
    console.log(path.join(__dirname));
  });
}, 1000);
