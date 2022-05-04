import { Router } from "express";
import passport from "passport";

export const router = Router();

router.post("/login", (req, res) => {
  if ((req.body.username, req.body.password)) {
    passport.authenticate("local", function (error, user) {
      if (error) return res.status(500).send(error);
      req.login(user, function (error) {
        if (error) return res.status(500).send(error);
        return res.status(200).send("Bejelentkezes sikeres");
      });
    })(req, res);
  } else {
    return res.status(400).send("Hibas keres, username es password kell");
  }
});

router.route("/logout").post((req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).send("Kijelentkezes sikeres");
  } else {
    return res.status(403).send("Nem is volt bejelentkezve");
  }
});
