import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "../config/db.js";

import productsRouter from "../routes/products.js";
import ordersRouter from "../routes/orders.js";
import cartsRouter from "../routes/carts.js";
import walletsRouter from "../routes/wallets.js";
import addressesRouter from "../routes/addresses.js";
import usersRouter from "../routes/users.js";
import wishlistsRouter from "../routes/wishlists.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/addresses", addressesRouter);
app.use("/api/users", usersRouter);
app.use("/api/wishlists", wishlistsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "API running" });
});

export default app;