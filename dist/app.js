"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = require("./modules/user/user.route");
const restaurant_route_1 = require("./modules/restaurant/restaurant.route");
const menu_route_1 = require("./modules/menu/menu.route");
const order_route_1 = require("./modules/order/order.route");
const app = (0, express_1.default)();
//corse setup :
const corsOptions = {
    // origin: "http://localhost:8000",
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// setup parser
app.use(body_parser_1.default.json({ limit: "10mb" })); //added limit data -> 10mb
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//router
app.use("/api/v1/user", user_route_1.UserRouters);
app.use("/api/v1/restaurant", restaurant_route_1.RestaurantRouter);
app.use("/api/v1/menu", menu_route_1.menuRouter);
app.use("/api/v1/order", order_route_1.OrderRoute);
app.get("/", (req, res) => {
    res.send("Hello World! The food server is running");
});
exports.default = app;
