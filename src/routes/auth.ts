import express from "express";
import { auth, register, username, verify, key, access, resend, login, google } from "../controllers/auth";
const router = express.Router();

router.get("/", auth);
router.post("/register", register);
router.get("/register/:username", username);
router.post("/verify", verify);
router.get("/verify", access);
router.patch("/verify", resend);
router.put("/verify/:key", key);
router.post("/login", login);
router.post("/google", google);

export default router;