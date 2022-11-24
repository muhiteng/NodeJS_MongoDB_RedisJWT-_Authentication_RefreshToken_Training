const User = require("../models/user.model");
async function Register(req, res) {
  // encrypt password
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const saved_user = await user.save();
    res.json({
      status: true,
      message: "Registered successfully.",
      data: saved_user,
    });
  } catch (error) {
    // do logging in DB or file.
    res
      .status(400)
      .json({ status: false, message: "Something went wrong.", data: error });
  }
}

module.exports = {
  Register,
};
