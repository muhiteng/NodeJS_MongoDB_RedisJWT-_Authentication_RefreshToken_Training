const route = require("express").Router();
const user_controller = require("../controllers/user.controller");
const auth_middleware = require("../middlewares/auth.middleware");

route.post("/register", user_controller.Register);

module.exports = route;
