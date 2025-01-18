import { Router } from "express";
import { checkAdmin } from "../../middleware/check-admin";

const route = Router();

route.post("/", checkAdmin, (req, res, next) => {
  res.json({ message: "Admin only can allowed for this api" });
});

export default route;
