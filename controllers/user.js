const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", (request, response) => {
  User.find({}).then((user) => {
    response.json(user);
  });
});

userRouter.get("/:id", (request, response, next) => {
  return User.findById(request.params.id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

userRouter.post("/", (request, response, next) => {
  if (request.body) {
    const newUser = new User({
      username: request.body.username,
      password: request.body.password,
      date: new Date(),
      id: request.body.id,
    });

    newUser
      .save()
      .then((createdUser) => {
        response.json(createdUser);
      })
      .catch((err) => next(err));
  }

  response.status(400).json({ error: "content missing" });
});

userRouter.put("/:id", (request, response, next) => {
  const updatedInfo = { password: request.body.password };

  const opts = { new: true, runValidators: true, context: "query" };

  User.findByIdAndUpdate(request.params.id, updatedInfo, opts)
    .then((updatedUser) => response.json(updatedUser))
    .catch((err) => next(err));
});

userRouter.delete("/:id", (request, response, next) => {
  User.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((err) => next(err));
});

module.exports = userRouter;
