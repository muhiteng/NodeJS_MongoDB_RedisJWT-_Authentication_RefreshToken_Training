const express = require("express");
const PORT = 8000;
const app = express();

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
