import express from "express";
import { RestaurantController } from "./restaurant.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import upload from "../../middlewares/multer";
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  upload.single("imageFile"),
  RestaurantController.createRestaurant
);
router.get("/", RestaurantController.getRestaurant);
router.put(
  "/",
  isAuthenticated,
  upload.single("imageFile"),
  RestaurantController.updateRestaurant
);
router.get("/order", RestaurantController.getRestaurantOrder);
router.put("/order/:orderId/status", RestaurantController.updateOrderStatus);
router.get("/search/:searchText", RestaurantController.searchRestaurant);
router.get("/:id", RestaurantController.getSingleRestaurant);

export const RestaurantRouter = router;
