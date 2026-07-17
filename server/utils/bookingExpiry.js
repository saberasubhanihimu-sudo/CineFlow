import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
export const checkExpiredBookings = async () => {
  try {
    const expiredBookings = await Booking.find({
      status: "pending",
      ispaid: false,
      expiresAt: { $lte: new Date() },
    });
    for (const booking of expiredBookings) {
      booking.status = "cancelled";
      await booking.save();
      const showData = await Show.findById(booking.show);
      if (showData) {
        booking.bookedSeats.forEach((seat) => {

          delete showData.occupiedSeats[seat];

        });
        showData.markModified("occupiedSeats");
        await showData.save();

      }
    }
  if (expiredBookings.length > 0) {
      console.log(
        `${expiredBookings.length} expired bookings cancelled`
      ); }
  } catch (error) {
 console.log(
      "Booking expiry error:",
      error.message
    );
  }
};