import { Router } from "express";
import { checkAuth } from "../../middleware/check-auth";
import { createCustomer } from "../../controller/customer/customer.controller";

const route = Router();

route.post("/", checkAuth, createCustomer);

export default route;
