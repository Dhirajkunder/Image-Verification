import express from "express";
import router from "./user.route.js";

const routes = express.Router();

routes.use("/user", router);

export default routes;
