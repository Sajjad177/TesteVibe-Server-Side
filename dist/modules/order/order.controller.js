"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const restaurant_model_1 = require("../restaurant/restaurant.model");
const order_model_1 = require("./order.model");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find({ user: req.id })
            .populate("user")
            .populate("restaurant");
        return res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
const createCheckOutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkOutSessionRequest = req.body;
        const restaurant = yield restaurant_model_1.Restaurant.findById(checkOutSessionRequest.restaurantId).populate("menu");
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }
        const order = new order_model_1.Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkOutSessionRequest.deliveryDetails,
            cartItems: checkOutSessionRequest.cartItems,
            status: "pending",
        });
        // line items :
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkOutSessionRequest, menuItems);
        // Create section :
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            shipping_address_collection: {
                allowed_countries: ["GB", "BD", "US", "CA"],
            },
            line_items: lineItems,
            mode: "payment",
            // this is like navigate after success :
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item) => item.image)),
            },
        });
        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: "Error while creating section",
            });
        }
        yield order.save();
        return res.status(200).json({
            success: true,
            session,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
const createLineItems = (checkOutSessionRequest, menuItems) => {
    //1. create line items
    const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id === cartItem.menuId);
        if (!menuItem) {
            throw new Error(`Menu item id not found`);
        }
        return {
            price_data: {
                currency: "BDT",
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        };
    });
    // 2. Return line items
    return lineItems;
};
exports.orderController = {
    createCheckOutSession,
    getOrders,
};
