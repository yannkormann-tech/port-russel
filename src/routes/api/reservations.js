const express = require("express");
const Reservation = require("../../models/Reservation");
const Catway = require("../../models/Catway");
const { ensureAuthenticated } = require("../../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use(ensureAuthenticated);

router.get("/", async (req, res) => {
  const catwayNumber = Number(req.params.id);
  const reservations = await Reservation.find({ catwayNumber }).sort({ startDate: 1 });
  res.json(reservations);
});

router.get("/:idReservation", async (req, res) => {
  const catwayNumber = Number(req.params.id);
  const reservation = await Reservation.findOne({
    _id: req.params.idReservation,
    catwayNumber,
  });

  if (!reservation) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  return res.json(reservation);
});

router.post("/", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const existingCatway = await Catway.findOne({ catwayNumber });

    if (!existingCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }

    const created = await Reservation.create({
      catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/:idReservation", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber,
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.clientName = req.body.clientName;
    reservation.boatName = req.body.boatName;
    reservation.startDate = req.body.startDate;
    reservation.endDate = req.body.endDate;

    await reservation.save();
    return res.json(reservation);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);
    const reservation = await Reservation.findOne({
      _id: req.body.idReservation,
      catwayNumber,
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.clientName = req.body.clientName;
    reservation.boatName = req.body.boatName;
    reservation.startDate = req.body.startDate;
    reservation.endDate = req.body.endDate;

    await reservation.save();
    return res.json(reservation);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:idReservation", async (req, res) => {
  const catwayNumber = Number(req.params.id);
  const deleted = await Reservation.findOneAndDelete({
    _id: req.params.idReservation,
    catwayNumber,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Reservation not found" });
  }

  return res.json({ message: "Reservation deleted" });
});

module.exports = router;
