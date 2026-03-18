const express = require("express");
const Catway = require("../../models/Catway");
const Reservation = require("../../models/Reservation");
const User = require("../../models/User");
const { ensureAuthenticated } = require("../../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/app/dashboard");
  }

  return res.render("auth/home", {
    title: "Port Russell - Accueil",
    error: null,
  });
});

router.get("/app/dashboard", ensureAuthenticated, async (req, res) => {
  const now = new Date();
  // On affiche les reservations actives aujourd'hui sur le dashboard.
  const activeReservations = await Reservation.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .sort({ endDate: 1 })
    .limit(20);

  return res.render("dashboard/index", {
    title: "Tableau de bord",
    today: now,
    activeReservations,
  });
});

router.get("/app/catways", ensureAuthenticated, async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  return res.render("catways/index", {
    title: "Gestion des catways",
    catways,
  });
});

router.post("/app/catways", ensureAuthenticated, async (req, res) => {
  try {
    await Catway.create({
      catwayNumber: Number(req.body.catwayNumber),
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState,
    });
    return res.redirect("/app/catways");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/app/catways/:id", ensureAuthenticated, async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });
  if (!catway) {
    return res.status(404).send("Catway not found");
  }

  return res.render("catways/details", {
    title: `Catway ${catway.catwayNumber}`,
    catway,
  });
});

router.put("/app/catways/:id", ensureAuthenticated, async (req, res) => {
  await Catway.findOneAndUpdate(
    { catwayNumber: Number(req.params.id) },
    { catwayState: req.body.catwayState },
    { runValidators: true }
  );

  return res.redirect(`/app/catways/${req.params.id}`);
});

router.delete("/app/catways/:id", ensureAuthenticated, async (req, res) => {
  await Catway.findOneAndDelete({ catwayNumber: Number(req.params.id) });
  return res.redirect("/app/catways");
});

router.get("/app/reservations", ensureAuthenticated, async (req, res) => {
  const reservations = await Reservation.find().sort({ startDate: -1 });
  return res.render("reservations/index", {
    title: "Gestion des reservations",
    reservations,
  });
});

router.post("/app/reservations", ensureAuthenticated, async (req, res) => {
  try {
    const catwayNumber = Number(req.body.catwayNumber);
    const catway = await Catway.findOne({ catwayNumber });

    if (!catway) {
      return res.status(400).send("Catway not found");
    }

    await Reservation.create({
      catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    return res.redirect("/app/reservations");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/app/reservations/:id", ensureAuthenticated, async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return res.status(404).send("Reservation not found");
  }

  return res.render("reservations/details", {
    title: `Reservation ${reservation._id}`,
    reservation,
  });
});

router.put("/app/reservations/:id", ensureAuthenticated, async (req, res) => {
  await Reservation.findByIdAndUpdate(
    req.params.id,
    {
      catwayNumber: Number(req.body.catwayNumber),
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    { runValidators: true }
  );

  return res.redirect(`/app/reservations/${req.params.id}`);
});

router.delete("/app/reservations/:id", ensureAuthenticated, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  return res.redirect("/app/reservations");
});

router.get("/app/users", ensureAuthenticated, async (req, res) => {
  const users = await User.find().select("-password").sort({ email: 1 });
  return res.render("users/index", {
    title: "Gestion des utilisateurs",
    users,
  });
});

router.post("/app/users", ensureAuthenticated, async (req, res) => {
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    return res.redirect("/app/users");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.get("/app/users/:email", ensureAuthenticated, async (req, res) => {
  const email = decodeURIComponent(req.params.email).trim().toLowerCase();
  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    return res.status(404).send("User not found");
  }

  return res.render("users/details", {
    title: `Utilisateur ${user.email}`,
    user,
  });
});

router.put("/app/users/:email", ensureAuthenticated, async (req, res) => {
  const email = decodeURIComponent(req.params.email).trim().toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send("User not found");
  }

  if (req.body.username) {
    user.username = req.body.username;
  }

  if (req.body.email) {
    user.email = req.body.email;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();
  return res.redirect(`/app/users/${encodeURIComponent(user.email)}`);
});

router.delete("/app/users/:email", ensureAuthenticated, async (req, res) => {
  const email = decodeURIComponent(req.params.email).trim().toLowerCase();
  await User.findOneAndDelete({ email });

  if (req.session.user && req.session.user.email === email) {
    return req.session.destroy(() => res.redirect("/"));
  }

  return res.redirect("/app/users");
});

module.exports = router;
