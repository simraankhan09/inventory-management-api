import { Router } from "express";
import { checkAdmin } from "../../middleware/check-admin";
import {
  createIdentificationType,
  getAllIdentificationTypes,
} from "../../controller/identification-type/identification-type.controller";
import { checkAuth } from "../../middleware/check-auth";

const route = Router();

route.post("/", checkAdmin, createIdentificationType);
route.get("/all", checkAuth, getAllIdentificationTypes);

export default route;
