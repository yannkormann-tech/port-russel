const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      index: true,
      min: 1,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    boatName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return this.startDate ? value >= this.startDate : true;
        },
        message: "endDate must be after startDate",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
