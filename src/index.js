require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { createClient } = require("redis");
const PORT = process.env.PORT || 4000;
// routes
const auth_routes = require("./routes/auth.route");

const app = express();
// connect to Redis
const REDIS_HOST = "redis"; // name of sevice redis in docker-compose
const REDIS_PORT = 6379; // mapping port in redis service  in docker-compose
const client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis is connected successfully"));

const connect_redis = async () => {
  await client.connect();
  await client.set("key", "value");
  const value = await client.get("key");
  //await client.disconnect();
};

connect_redis();

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

app.use("/auth", auth_routes);
let refreshTokens = [];
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
    const refresh_token = generateRefreshToken(userName);

    res.status(200).json({
      status: true,
      message: "login successfully done",
      data: { access_token: access_token, refresh_token: refresh_token },
    });
  }

  res.status(401).json({ status: true, message: "login failed" });
});

app.post("/token", verifyRefreshToken, (req, res) => {
  const username = req.userData.sub;
  const access_token = jwt.sign(
    { sub: username },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TIME }
  );

  const refresh_token = generateRefreshToken(username);

  res.status(200).json({
    status: true,
    message: "login successfully done",
    data: { access_token: access_token, refresh_token: refresh_token },
  });
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    status: true,
    message: "Welcome to Dashboard",
  });
});

app.get("/logout", verifyToken, (req, res) => {
  const username = req.userData.sub;
  // Remove refreshToken
  refreshTokens = refreshTokens.filter((x) => x.username !== username);
  res.json({
    status: true,
    message: "logout successfuly done",
  });
});

// Custom middleware
function verifyToken(req, res, next) {
  try {
    // Bearer tokenString
    const access_token = req.headers.authorization.split(" ")[1];

    const decode = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);

    req.userData = decode;
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Your session expired",
      data: { error: error },
    });
  }
}

function verifyRefreshToken(req, res, next) {
  try {
    const token = req.body.token;
    if (token === null)
      res.status(401).json({
        status: false,
        message: "Invalid request",
      });

    const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    req.userData = decode;
    // verify if token in store or not
    let storedRefreshToken = refreshTokens.find(
      (x) => x.username === decode.sub
    );

    if (storedRefreshToken === undefined)
      res.status(401).json({
        status: false,
        message: "Invalid request, token is not in  store",
      });
    if (storedRefreshToken.token != token)
      res.status(401).json({
        status: false,
        message: "Invalid request, token is not same in  store",
      });

    next();
  } catch (error) {
    res.status(401).json({
      status: true,
      message: "Your session expired",
      data: { error: error },
    });
  }
}
function generateRefreshToken(username) {
  const refresh_token = jwt.sign(
    { sub: username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TIME }
  );
  let storedRefreshToken = refreshTokens.find((x) => x.username === username);
  if (storedRefreshToken === undefined) {
    //add token
    refreshTokens.push({
      username: username,
      token: refresh_token,
    });
  } else {
    // update token
    refreshTokens[
      refreshTokens.findIndex((x) => x.username === username)
    ].token = refresh_token;
  }

  return refresh_token;
}

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
