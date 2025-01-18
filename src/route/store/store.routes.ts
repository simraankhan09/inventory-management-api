import { Router } from "express";
import { checkAuth } from "../../middleware/check-auth";
import { createStore } from "../../controller/store/store.controller";

const route = Router();

route.post("/", checkAuth, createStore);

export default route;
