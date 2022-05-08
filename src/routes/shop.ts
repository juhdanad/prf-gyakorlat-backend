import { Router } from "express";
import { IOrder, Order } from "../documents/order";
import { Product } from "../documents/product";
export const router = Router();

router.post("/", async function (req, res) {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .send({ error: "Ehhez csak bejelentkezett felhasználó fér hozzá!" });
  }
  const orders: any = req.body.orders;
  if (!Array.isArray(orders)) {
    return res.status(400).send({ error: "A megadott érték nem tömb!" });
  }
  const validatedOrders: { id: string; num: number }[] = [];
  for (const order of orders) {
    const productId = order._id;
    const productNum = order.quantity;
    if (!productId) {
      return res.status(400).send({ error: "Nincs megadva termék azonosító!" });
    }
    if (!productNum) {
      return res.status(400).send({ error: "Nincs megadva termék mennyiség!" });
    }
    const productNumInt = parseInt(productNum);
    if (isNaN(productNumInt) || productNumInt < 1) {
      return res.status(400).send({ error: "Hibás termék mennyiség!" });
    }
    validatedOrders.push({ id: productId, num: productNum });
  }
  const orderDocument: IOrder = {
    date: new Date(),
    total: 0,
    username: req.user.username,
    products: [],
  };
  let allSuccess = true;
  for (const order of validatedOrders) {
    try {
      const product = await Product.findById(order.id).exec();
      if (!product) throw new Error("Nincs ilyen termék!");
      const finalQuantity = Math.min(product.quantityLeft, order.num);
      if (finalQuantity != order.num) allSuccess = false;
      product.quantityLeft -= finalQuantity;
      await product.save();
      orderDocument.products.push({
        name: product.name,
        productId: product.id,
        quantity: finalQuantity,
        subtotal: finalQuantity * product.price,
      });
    } catch (e) {
      allSuccess = false;
    }
  }
  orderDocument.total = orderDocument.products.reduce(
    (acc, p) => acc + p.subtotal,
    0
  );
  try {
    await new Order(orderDocument).save();
    if (allSuccess) {
      return res.send({ message: "Sikeres rendelés!" });
    } else {
      return res.send({
        message:
          "Néhány termékből nem tudunk megfelelő mennyiséget szállítani. Kérjük, nézze meg a rendelését!",
      });
    }
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});
