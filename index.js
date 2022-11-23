require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;

const app = express();

// middleware to parse request
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.status(200).send("Server working ....");
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  if (userName === "Moh" && password === "123") {
    const access_token = jwt.sign(
      { sub: userName },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    res
      .status(200)
      .json({
        status: true,
        message: "login successfully done",
        data: { access_token: access_token },
      });
  }

  res.status(401).json({ status: true, message: "login failed" });
});
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
