import express from "express";
import {
  login,
  getTime,
  getToken,
  kickout,
  signup,
} from "../services/index.js";
// import { login, getTime, getToken, kickout } from "../services/index";

const router = express.Router();
router.post("/signup", async (req, res) => {
  let response = await signup(req.body);
  res.json(response);
});
router.post("/login", async (req, res) => {
  let response = await login(req.body);
  res.json(response);
});

router.get("/getTime/:id", async (req, res) => {
  let response = await getTime(req.params.id);
  res.json(response);
});

router.get("/getToken/:id", async (req, res) => {
  console.log("triggered");
  let response = await getToken(req.params.id);
  res.json(response);
});

router.post("/kickout", async (req, res) => {
  let response = await kickout(req.body);
  res.json(response);
});

export { router };
