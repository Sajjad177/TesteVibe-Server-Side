import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { orderController } from "./order.controller";

const router = express.Router();

router.get("/", isAuthenticated, orderController.getOrders);
router.post(
  "/checkout/create-checkout-session",
  isAuthenticated,
  orderController.createCheckOutSession
);
// router

export const OrderRoute = router;
