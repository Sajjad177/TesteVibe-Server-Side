"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.get("/", isAuthenticated_1.isAuthenticated, order_controller_1.orderController.getOrders);
router.post("/checkout/create-checkout-session", isAuthenticated_1.isAuthenticated, order_controller_1.orderController.createCheckOutSession);
// router
exports.OrderRoute = router;
