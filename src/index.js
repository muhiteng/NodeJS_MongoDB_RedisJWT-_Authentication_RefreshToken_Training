require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 4000;
const app = express();

// connect MongoDB
const DB_USER = "root";
const DB_PASSWORD = "example";
const DB_HOST = "mongo"; // name of service in docker-commpose
const DB_PORT = 27017; // mapping port in mongo service  in docker-compose

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;

mongoose
  .connect(URI)
  .then(() => console.log("connected to mongodb : successfully"))
  .catch((err) => console.log(err));

// middileware
app.use(express.json());

// routes
const auth_routes = require("./routes/auth.route");
const user_routes = require("./routes/user.route");

app.use("/auth", auth_routes);
app.use("/user", user_routes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
