const { createClient } = require("redis");
// connect to Redis
const REDIS_HOST = "redis"; // name of sevice redis in docker-compose
const REDIS_PORT = 6379; // mapping port in redis service  in docker-compose
const redis_client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
redis_client.on("error", (err) => console.log("Redis Client Error", err));
redis_client.on("connect", () => console.log("Redis is connected successfully"));

const connect_redis = async () => {
  await redis_client.connect();
  // await redis_client.set("key", "value");
  // const value = await client.get("key");
  //await client.disconnect();
};

connect_redis();
module.exports = redis_client;
