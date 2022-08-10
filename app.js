const { PORT, URI } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./controllers/user");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
const { info, error } = require("./utils/logger");
const mongoose = require("mongoose");

info("attempting connection to MongoDB");

mongoose
  .connect(URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((err) => error("error connecting to MongoDB", err.message));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
