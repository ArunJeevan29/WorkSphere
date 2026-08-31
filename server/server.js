require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const errorMiddleware = require("./middleware/errorMiddleware");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auditlogs", auditLogRoutes);

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`App is running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
