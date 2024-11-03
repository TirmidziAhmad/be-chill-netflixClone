require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.config");
const { initializeModels } = require("./models");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database and initialize models
(async () => {
  await connectDB();
  await initializeModels();
})();

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
