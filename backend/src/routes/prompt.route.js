import { Router } from "express";

import { Createprompt } from "../controllers/prompt.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/").post(verifyJWT,
  Createprompt
)

export default router;
