const express = require("express");
const Catway = require("../../models/Catway");
const { ensureAuthenticated } = require("../../middleware/auth");

const router = express.Router();

router.use(ensureAuthenticated);

router.get("/", async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.json(catways);
});

router.get("/:id", async (req, res) => {
  const catwayNumber = Number(req.params.id);
  const catway = await Catway.findOne({ catwayNumber });

  if (!catway) {
    return res.status(404).json({ message: "Catway not found" });
  }

  return res.json(catway);
});

router.post("/", async (req, res) => {
  try {
    const payload = {
      catwayNumber: Number(req.body.catwayNumber),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState,
    };

    const created = await Catway.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const catway = await Catway.findOne({ catwayNumber });

    if (!catway) {
      return res.status(404).json({ message: "Catway not found" });
    }

    catway.catwayState = req.body.catwayState;
    await catway.save();

    return res.json(catway);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const catwayNumber = Number(req.params.id);
  const deleted = await Catway.findOneAndDelete({ catwayNumber });

  if (!deleted) {
    return res.status(404).json({ message: "Catway not found" });
  }

  return res.json({ message: "Catway deleted" });
});

module.exports = router;
