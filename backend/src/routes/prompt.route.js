import { Router } from "express";

import { Createprompt, getPromptHistory,deletePromptHistoryById,deleteAllPromptHistory } from "../controllers/prompt.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/").post(verifyJWT,
  Createprompt
)

router.route("/getResponseHistory").get(verifyJWT,
  getPromptHistory
)

router.route("/deleteById/:promptId").delete(verifyJWT,
  deletePromptHistoryById
)

router.route("/deleteAllPromptHistory").delete(verifyJWT,
  deleteAllPromptHistory
)

export default router;
