import express from "express";
import {
  registerController,
  loginController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
// router object

const router = express.Router();

// routing

//register
router.post("/register", registerController);
//login
router.post("/login", loginController);

// protected routes via middleware injection which will make it compulasory to have a token before log in
router.post("/test", requireSignin, isAdmin, testController);
export default router;

// protected routes

router.get("/userAuth", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});
