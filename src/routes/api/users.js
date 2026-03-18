const express = require("express");
const User = require("../../models/User");
const { ensureAuthenticated } = require("../../middleware/auth");

const router = express.Router();

router.use(ensureAuthenticated);

router.get("/", async (req, res) => {
  const users = await User.find().select("-password").sort({ email: 1 });
  res.json(users);
});

router.get("/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email).trim().toLowerCase();
  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});

router.post("/", async (req, res) => {
  try {
    const payload = {
      username: (req.body.username || "").trim(),
      email: (req.body.email || "").trim().toLowerCase(),
      password: (req.body.password || "").trim(),
    };

    const created = await User.create(payload);
    return res.status(201).json({
      id: created._id,
      username: created.username,
      email: created.email,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) {
      user.username = req.body.username.trim();
    }

    if (req.body.password) {
      user.password = req.body.password.trim();
    }

    if (req.body.email) {
      user.email = req.body.email.trim().toLowerCase();
    }

    await user.save();

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email).trim().toLowerCase();
  const deleted = await User.findOneAndDelete({ email });

  if (!deleted) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ message: "User deleted" });
});

module.exports = router;
