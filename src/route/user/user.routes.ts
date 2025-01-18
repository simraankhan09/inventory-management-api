import { Router } from "express";
import {
  getUserDetails,
  userSignIn,
  userSignUp,
} from "../../controller/user/user.controller";
import { checkAuth } from "../../middleware/check-auth";

const route = Router();

route.post("/sign-up", userSignUp);
route.post("/sign-in", userSignIn);
route.get("/user-details", checkAuth, getUserDetails);

export default route;
