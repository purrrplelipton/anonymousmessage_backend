require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const User = require("./models/user");

const logger = (req, res, nxt) => {
  console.log("METHOD", req.method);
  console.log("PATH", req.path);
  console.log("BODY", req.body);
  console.log("___");
  nxt();
};

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(logger);

app.get("/api/users", (req, res, nxt) => {
  User.find({})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => nxt(err));
});

app.get("/api/users/:id", (req, res, nxt) => {
  User.findById(req.param.id)
    .then((user) => {
      if (user) {
        res.json(user);
      }
      res.status(404).end();
    })
    .catch((err) => nxt(err));
});

app.post("/api/users", (req, res, nxt) => {
  if (req.body) {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      date: new Date(),
      id: req.body.id,
    });

    return note
      .save()
      .then((savedUser) => {
        res.json(savedUser);
      })
      .catch((err) => nxt(err));
  }
  res.status(400).json({
    error: "content missing",
  });
});

app.put("/api/users/:id", (req, res, nxt) => {
  const { username, password } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { username, password },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => nxt(err));
});

app.delete("/api/users/:id", (req, res, nxt) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => nxt(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, nxt) => {
  console.error(err);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  }

  nxt(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
