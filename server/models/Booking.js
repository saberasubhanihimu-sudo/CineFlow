import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { 
      type: String, 
      required: true, 
      ref: "User" 
    },

    show: { 
      type: String, 
      required: true, 
      ref: "Show" 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    bookedSeats: { 
      type: Array, 
      required: true 
    },

    ispaid: { 
      type: Boolean, 
      default: false 
    },

    paymentLink: { 
      type: String 
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
    },

  },
  { 
    timestamps: true 
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;