require("dotenv").config();

const { connectDatabase } = require("../src/config/db");
const Catway = require("../src/models/Catway");
const Reservation = require("../src/models/Reservation");
const User = require("../src/models/User");
const catways = require("../data/catways.json");
const reservations = require("../data/reservations.json");

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/port_russel";

async function seed() {
  await connectDatabase(mongoUri);

  await Catway.deleteMany({});
  await Reservation.deleteMany({});

  await Catway.insertMany(catways);
  await Reservation.insertMany(reservations);

  const adminEmail = "admin@russell-port.local";
  const adminPassword = "Admin1234!";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      username: "admin-russell",
      email: adminEmail,
      password: adminPassword,
    });
  } else {
    existingAdmin.username = "admin-russell";
    existingAdmin.password = adminPassword;
    await existingAdmin.save();
  }

  console.log("Seed completed");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
