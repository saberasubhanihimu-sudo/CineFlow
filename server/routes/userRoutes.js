import express from "express";
import {
  getFavorites,
  getUserBookings,
  updateFavorite,
  confirmDummyPayment,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.post("/update-favorite", updateFavorite);
userRouter.get("/favorites", getFavorites);

userRouter.post("/confirm-payment", confirmDummyPayment);

export default userRouter;