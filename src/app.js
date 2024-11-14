const express = require("express");
require("dotenv").config({ path: "./.env" });

//import routes
const { userRoutes, movieRoutes, authRoutes } = require("./routes/index.routes");
//server
const app = express();
const port = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

//routes to get any other page
app.get("*", (req, res) => res.status(404).json({ code: 404, message: "Page not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

//listen
app.listen(port, () => {
  console.log("listening on port " + port);
});
