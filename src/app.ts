import { compare } from "bcrypt";
import cookieParser from "cookie-parser";
import express from "express";
import expressSession from "express-session";
import logger from "morgan";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import path from "path";
import { IUserLocal, User } from "./documents/user";
import { router as indexRouter } from "./routes";
import { router as loginRouter } from "./routes/login";
import { router as usersRouter } from "./routes/users";

passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user || !(await compare(password, user.hashedPassword))) {
        return done("Nincs ilyen felhasználónév és jelszó!");
      }
      return done(undefined, user);
    } catch (e) {
      return done("Hiba lekeres soran");
    }
  })
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUserLocal {}
  }
}

passport.serializeUser<IUserLocal>((user, done) => {
  if (!user) return done("nincs megadva felhasználó");
  return done(undefined, { username: user.username, type: user.type });
});
passport.deserializeUser<IUserLocal>((user, done) => {
  if (!user) return done("nincs user akit kiléptethetnénk");
  return done(undefined, user);
});

export const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  expressSession({
    secret: process.env.COOKIE_SECRET || "alapjelszo",
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "strict", httpOnly: true },
  })
);
app.use(passport.session());

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api", loginRouter);

app.use("/api", function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.status(403).send("Nincs bejelentkezve!");
});

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);

app.use(function (_req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// error handler
app.use(function (err: any, req: any, res: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});
