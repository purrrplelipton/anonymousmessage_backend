const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("attempting to connect to MongoDB");

mongoose
  .connect(url)
  .then(() => console.log("connection established"))
  .catch((err) => console.log("failed to connect to MongoDB", err.message));

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
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("user", userSchema);
