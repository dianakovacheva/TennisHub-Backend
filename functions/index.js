global.__basedir = __dirname;
require("dotenv").config();
const dbConnector = require("./config/db");
const apiRouter = require("./router");
const cors = require("cors");
const { errorHandler } = require("./utils");

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { setGlobalOptions } = require("firebase-functions/v2");

setGlobalOptions({ region: "europe-west1" });

dbConnector();

const config = require("./config/config");

const app = require("express")();
require("./config/express")(app);

app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(config.port, console.log(`Listening on port ${config.port}!`));

exports.app = onRequest(app);
