const express = require("express");
const routes = require("route.js");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("assets"));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
