"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRouter = void 0;
const express_1 = __importDefault(require("express"));
const restaurant_controller_1 = require("./restaurant.controller");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
router.post("/", isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), restaurant_controller_1.RestaurantController.createRestaurant);
router.get("/", restaurant_controller_1.RestaurantController.getRestaurant);
router.put("/", isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), restaurant_controller_1.RestaurantController.updateRestaurant);
router.get("/order", restaurant_controller_1.RestaurantController.getRestaurantOrder);
router.put("/order/:orderId/status", restaurant_controller_1.RestaurantController.updateOrderStatus);
router.get("/search/:searchText", restaurant_controller_1.RestaurantController.searchRestaurant);
router.get("/:id", restaurant_controller_1.RestaurantController.getSingleRestaurant);
exports.RestaurantRouter = router;
