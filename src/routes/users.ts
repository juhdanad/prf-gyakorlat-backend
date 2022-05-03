import { Router } from "express";
export const router = Router();

router.get("/", function (req, res) {
  res.send("respond with a resource");
});
