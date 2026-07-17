import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import transporter from "../configs/mail.js";
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const expiredBookings = await Booking.find({
      user,
      status: "pending",
      ispaid: false,
      expiresAt: { $lt: new Date() },
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
    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }
    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites =
        user.privateMetadata.favorites.filter(
          (item) => item !== movieId
        );
    }
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({
      success: true,
      message: "Favorite movies updated",
    });

  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);

    const favorites = user.privateMetadata.favorites || [];

    const movies = await Movie.find({
      _id: { $in: favorites },
    });

    res.json({ success: true, movies });

  } catch (error) {
    console.error(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const confirmDummyPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.auth().userId;

    const booking = await Booking.findById(bookingId).populate({
      path: "show",
      populate: {
        path: "movie",
      },
    });

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }
    booking.ispaid = true;
    booking.status = "confirmed";

    await booking.save();
    
    const user = await clerkClient.users.getUser(userId);

    const email = user.emailAddresses[0]?.emailAddress;

    if (email) {
      const movieName = booking.show.movie.title;
      const seats = booking.bookedSeats.join(", ");
      const amount = booking.amount;
      const date = new Date(
        booking.show.showDateTime
      ).toLocaleDateString();
      const time = new Date(
        booking.show.showDateTime
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎬 CineFlow Booking Confirmation",

        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px;">
          <h2 style="color:#6C63FF;text-align:center;">
            🎉 Booking Confirmed
          </h2>

          <p>Hello <b>${user.firstName || "User"}</b>,</p>

          <p>Your payment was successful.</p>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td><b>Movie</b></td>
              <td>${movieName}</td>
            </tr>

            <tr>
              <td><b>Date</b></td>
              <td>${date}</td>
            </tr>

            <tr>
              <td><b>Time</b></td>
              <td>${time}</td>
            </tr>

            <tr>
              <td><b>Seats</b></td>
              <td>${seats}</td>
            </tr>

            <tr>
              <td><b>Total Amount</b></td>
              <td>$${amount}</td>
            </tr>

            <tr>
              <td><b>Booking ID</b></td>
              <td>${booking._id}</td>
            </tr>
          </table>

          <br>

          <p>
            Thank you for choosing
            <b>CineFlow</b>.
          </p>

          <h3 style="color:green;">
            Enjoy your movie! 🍿
          </h3>
        </div>
        `,
      });
    }

    res.json({
      success: true,
      message: "Payment Successful",
    });

  } catch (error) {
    console.error(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};