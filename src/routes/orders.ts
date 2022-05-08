import { Router } from "express";
import { Order } from "../documents/order";
export const router = Router();

router.get("/", async function (req, res) {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .send({ error: "Ehhez csak bejelentkezett felhasználó fér hozzá!" });
  }
  try {
    const orders =
      req.user.type === "admin"
        ? await Order.find().exec()
        : await Order.find({ username: req.user.username }).exec();
    return res.send(orders.map((o) => o.toObject()));
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});
