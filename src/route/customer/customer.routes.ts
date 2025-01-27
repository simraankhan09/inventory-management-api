import { Router } from "express";
import { checkAuth } from "../../middleware/check-auth";
import {
  createCustomer,
  customerSearch,
  getCustomersByUserId,
} from "../../controller/customer/customer.controller";

const route = Router();

route.post("/", checkAuth, createCustomer);

route.get("/all", checkAuth, getCustomersByUserId);
route.get("/search", checkAuth, customerSearch);

export default route;
