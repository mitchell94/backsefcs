const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const json = require("morgan-json");
const fs = require("fs");
const verifyToken = require("./server/middlewares/auth");
const appRoot = require("app-root-path");
const path = require("path");
const app = express();

const security = require("./server/routes/security");
const general = require("./server/routes/general");
const programs = require("./server/routes/programs");
const accounting = require("./server/routes/accounting");
const person = require("./server/routes/person");
const registration = require("./server/routes/registration");
const intranet = require("./server/routes/intranet");
// web
const web = require("./server/routes/web");
// end web
const env = process.env.NODE_ENV;
const config = require("./config");
app.use(
  helmet({
    frameguard: {
      action: "deny",
    },
  })
);

let publicFolder = "";
let urlServerPlublic = "";
let optionMorgan = "";
let urlAccessLogStream = "";

if (env === "dev") {
  publicFolder = path.join(__dirname, "..", "seunsm", "public");

  urlAccessLogStream = "./server/logs/accessDev.log";
  optionMorgan = json(
    ":remote-addr :date[iso] :method :url :status :response-time ms :id :params :body"
  );
}
if (env === "test") {
  urlServerPlublic = publicFolder;
  urlAccessLogStream = `${appRoot}/server/logs/accessTest.log`;
  optionMorgan = json(
    ":remote-addr - :date :method :url :http-version :status  :id :params :body "
  );
}
if (env === "pro") {
  if (config.SYSTEM === "SEFCSUNSM") {
    publicFolder = path.join(__dirname, "..", "seunsm/public");
  }
  // AÑADIR "ELSE" PARA OTROS SISTEMAS
  urlServerPlublic = publicFolder;
  urlAccessLogStream = `${appRoot}/server/logs/accessPro.log`;
  optionMorgan = json(
    ":remote-addr - :date :method :url :http-version :status  :id :params :body"
  );
}

//*************************************************//

const accessLogStream = fs.createWriteStream(urlAccessLogStream, {
  flags: "a",
});
morgan.token("id", (req, res) => req.userId);
// morgan.token('id', (req, res) => JSON.stringify(req.userId));
morgan.token("body", (req, res) => JSON.stringify(req.body));
morgan.token("params", (req, res) => JSON.stringify(req.params));
app.use(cors());
app.use(morgan(optionMorgan, { stream: accessLogStream }));
app.use(multipart({ uploadDir: urlServerPlublic }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/api/person-photography",
  express.static(publicFolder + "/person/photography/")
);
app.use(
  "/api/voucher-postulant",
  express.static(publicFolder + "/postulantVoucher/")
);
app.use("/api/docs", express.static(publicFolder + "/person/docs/"));
app.use("/api/docs-program", express.static(publicFolder + "/program/"));
app.use("/api/docs-student", express.static(publicFolder + "/person/student/"));

app.use("/api/voucher/:img", verifyToken, async (req, res) => {
  res.sendFile(publicFolder + "/person/voucher/" + req.params.img);
});
app.use("/api/student-document/:file", async (req, res) => {
  res.download(publicFolder + "/person/studentDocument/" + req.params.file);
});
app.use("/api/sustentation/:file", async (req, res) => {
  res.download(publicFolder + "/project/" + req.params.file);
});
app.use("/api/photo/:file", verifyToken, async (req, res) => {
  res.download(publicFolder + "/person/photography/" + req.params.file);
});

app.use("/api/security", security);
app.use("/api/general", general);
app.use("/api/programs", programs);
app.use("/api/accounting", accounting);
app.use("/api/person", person);
app.use("/api/registration", registration);
app.use("/api/intranet", intranet);
// web
app.use("/api/web", web);

module.exports = app;
