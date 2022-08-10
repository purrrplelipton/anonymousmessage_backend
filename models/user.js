const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, "username is too short"],
    validate: {
      validator: (v) => !/\W\./.test(v),
      message: "username contains invalid characters",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "password is too short"],
    validate: {
      validator: (v) => !/[\\"'`]/.test(v),
      message: "password contains invalid characters",
    },
  },
  id: { type: Number, required: true, unique: true },
  date: { type: Date },
  messages: [{ type: String, date: Date }],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("user", userSchema);
