const express = require("express");
const User = require("../../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      if (req.accepts("html")) {
        return res.status(400).render("auth/home", {
          title: "Port Russell - Accueil",
          error: "Email et mot de passe requis",
        });
      }

      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      if (req.accepts("html")) {
        return res.status(401).render("auth/home", {
          title: "Port Russell - Accueil",
          error: "Identifiants invalides",
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      if (req.accepts("html")) {
        return res.status(401).render("auth/home", {
          title: "Port Russell - Accueil",
          error: "Identifiants invalides",
        });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    if (req.accepts("html")) {
      return res.redirect("/app/dashboard");
    }

    return res.json({ message: "Logged in", user: req.session.user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");

    if (req.accepts("html")) {
      return res.redirect("/");
    }

    res.json({ message: "Logged out" });
  });
});

module.exports = router;
