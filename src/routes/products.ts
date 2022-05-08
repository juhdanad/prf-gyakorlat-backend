import { Router } from "express";
import { IProduct, Product } from "../documents/product";
export const router = Router();

router.get("/", async function (req, res) {
  try {
    const products = await Product.find().exec();
    return res.send(products.map((p) => p.toObject()));
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
      return res.status(404).send({ error: "Nincs ilyen termék!" });
    }
    return res.send(product.toObject());
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});

function validateProductBody(body: any): IProduct {
  const name = String(body.name);
  const description = String(body.description || "");
  const imageURL = String(body.imageURL || "");
  if (body.quantityLeft == null) {
    throw new Error("A megmaradó mennyiség kötelező!");
  }
  const quantityLeft = parseInt(String(body.quantityLeft));
  if (isNaN(quantityLeft) || quantityLeft < 0) {
    throw new Error("Érvénytelen mennyiség!");
  }
  if (body.price == null) {
    throw new Error("Az ár megadása kötelező!");
  }
  const price = parseInt(String(body.price));
  if (isNaN(price) || price < 0) {
    throw new Error("Érvénytelen ár!");
  }
  return {
    name,
    description,
    imageURL,
    quantityLeft,
    price,
  };
}

router.post("/", async function (req, res) {
  if (!req.isAuthenticated() || req.user.type !== "admin") {
    return res.status(403).send({ error: "Ehhez csak az admin fér hozzá!" });
  }
  let product: IProduct;
  try {
    product = validateProductBody(req.body);
  } catch (e: any) {
    return res.status(400).send({ error: e.message });
  }
  try {
    await new Product(product).save();
    return res.send({ message: "Mentve!" });
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});

router.put("/:id", async function (req, res) {
  if (!req.isAuthenticated() || req.user.type !== "admin") {
    return res.status(403).send({ error: "Ehhez csak az admin fér hozzá!" });
  }
  let product: IProduct;
  try {
    product = validateProductBody(req.body);
  } catch (e: any) {
    return res.status(400).send({ error: e.message });
  }
  try {
    const updateResult = await Product.updateOne(
      { _id: req.params.id },
      { $set: product }
    ).exec();
    if (updateResult.matchedCount === 0) {
      return res.status(404).send({ error: "Nincs ilyen termék!" });
    }
    return res.send({ message: "Mentve!" });
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const deleteResult = await Product.deleteOne({ _id: req.params.id }).exec();
    if (deleteResult.deletedCount === 0) {
      return res.status(404).send({ error: "Nincs ilyen termék!" });
    }
    return res.send({ error: "Törölve!" });
  } catch (e) {
    return res.status(500).send({ error: "Hiba történt!" });
  }
});
