import express, { NextFunction, Request, Response } from "express";
import dotEnv from "dotenv";
import { connectDatabase } from "./utils/connect-database";
import morgan from "morgan";
import userRoutes from "./route/user/user.routes";
import commonAddressRoutes from "./route/common-address/common-address.routes";
import storeRoute from "./route/store/store.routes";

dotEnv.config();

const apiUrlPrefix = `/api/${process.env.API_VERSION}`;

connectDatabase();

const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
  }
  next();
});

// Routes
app.use(`${apiUrlPrefix}/user`, userRoutes);
app.use(`${apiUrlPrefix}/common-address`, commonAddressRoutes);
app.use(`${apiUrlPrefix}/store`, storeRoute);

// error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  // @ts-ignore
  error.code = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.code || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
