import { Router } from "express";
import { checkAdmin } from "../../middleware/check-admin";
import { createIdentificationType } from "../../controller/identification-type/identification-type.controller";

const route = Router();

route.post("/", checkAdmin, createIdentificationType);

export default route;
