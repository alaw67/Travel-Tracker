import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5050;
const app = express();

app.use(
  cors({
    origin: "https://trekd.live/", // or custom domain
    credentials: true, // if using cookies or auth headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);

app.use(errorHandler);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
