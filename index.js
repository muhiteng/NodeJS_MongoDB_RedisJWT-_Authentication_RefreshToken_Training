const express = require("express");
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
    res.status(200).json({ status: true, message: "login successfully done" });
  }

  res.status(401).json({ status: true, message: "login failed" });
});
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
