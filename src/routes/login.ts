import { Router } from "express";
import passport from "passport";
import { IUser } from "../documents/user";

export const router = Router();

router.post("/login", (req, res) => {
  if ((req.body.username, req.body.password)) {
    passport.authenticate("local", function (error, user: IUser) {
      if (error)
        return res
          .status(400)
          .send({ error: "Helytelen bejelentkezési adatok!" });
      req.login(user, function (error) {
        if (error)
          return res.status(500).send({ error: "Hiba a bejelentkezés során!" });
        return res
          .status(200)
          .send({ username: user.username, type: user.type });
      });
    })(req, res);
  } else {
    return res
      .status(400)
      .send({ error: "Nincs megadva felhasználónév vagy jelszó!" });
  }
});

router.route("/currentUser").get((req, res) => {
  return res
    .status(200)
    .send(
      req.isAuthenticated()
        ? { username: req.user.username, type: req.user.type }
        : null
    );
});

router.route("/logout").post((req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).send({ message: "Kijelentkezes sikeres" });
  } else {
    return res.status(403).send({ error: "Nem is volt bejelentkezve" });
  }
});
