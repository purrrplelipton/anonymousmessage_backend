const { info, error } = require("./logger");

const requestLogger = (request, response, next) => {
  info("METHOD", request.method);
  info("PATH", request.path);
  info("BODY", request.body);
  info("---");

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, request, response, next) => {
  error(err.message);

  if (err.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return response.status(400).send({ error: err.message });
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).send({ error: "there was a duplicate key error" });
  }

  next(err);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
