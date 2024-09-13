import mongoose from "mongoose";
import { IRestaurantDocument } from "./restaurant.interface";

const restaurantSchema = new mongoose.Schema<IRestaurantDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    deliveryTime: { type: Number, required: true },
    cuisines: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
