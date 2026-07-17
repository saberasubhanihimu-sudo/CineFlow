import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    await User.create(userData);
  },
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  },
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-with-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    await User.findByIdAndUpdate(id, userData);
  },
);

const cancelUnpaidBooking = inngest.createFunction(
  {
    id: "cancel-unpaid-booking",
    triggers: [{ event: "booking/created" }],
  },

  async ({ event, step }) => {
    const { bookingId } = event.data;

    console.log("Cancel timer started for booking:", bookingId);

    await step.sleep("wait-20-minutes", "30s");

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      console.log("Booking not found");
      return;
    }

    if (booking.ispaid) {
      console.log("Already paid");

      return;
    }

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

    console.log("Booking cancelled:", bookingId);
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  cancelUnpaidBooking,
];
