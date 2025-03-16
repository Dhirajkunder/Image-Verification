import express from "express";
import "./helper/db.connection.js";
import "dotenv/config";
import cors from "cors";
import routes from "./Routes/index.js";

const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//input taker
app.use(express.json({ limit: "50mb" }));
app.use(express.static("images"));

//main routes
app.use("/", routes);

//ERROR MIDDLEWARE
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
app.listen(4000, () => {
  console.log(`server started listening on port ${4000}`);
});
