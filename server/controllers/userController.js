import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

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

    const booking = await Booking.findById(bookingId);

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

    res.json({
      success: true,
      message: "Payment Successful",
    });

  } catch (error) {
    console.error(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};