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
exports.menuController = void 0;
const imageUpload_1 = __importDefault(require("../../utils/imageUpload"));
const menu_model_1 = require("./menu.model");
const restaurant_model_1 = require("../restaurant/restaurant.model");
// import { IMenuDocument } from "./menu.interface";
// Define a type for the menu payload (incoming data)
// type IMenuPayload = {
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// };
const addMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }
        // upload image in cloudinary
        const imageUrl = yield (0, imageUpload_1.default)(file);
        const menu = yield menu_model_1.Menu.create({
            name,
            description,
            price,
            image: imageUrl,
        });
        const restaurant = yield restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            restaurant.menus.push(menu._id);
            // restaurant.menus.push(menu._id);
            yield restaurant.save();
        }
        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const editMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        const file = req.file;
        const menu = yield menu_model_1.Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!",
            });
        }
        if (name)
            menu.name = name;
        if (description)
            menu.description = description;
        if (price)
            menu.price = price;
        //checking image exist in cloudinary
        if (file) {
            const imageUrl = yield (0, imageUpload_1.default)(file);
            menu.image = imageUrl;
        }
        // updated menus
        yield menu.save();
        return res.status(201).json({
            success: true,
            message: "Menu updated successfully",
            menu,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
const deletedMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const menu = yield menu_model_1.Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!",
            });
        }
        yield menu.deleteOne();
        // Optional: Remove reference from the restaurant's menu list
        // const restaurant = await Restaurant.findOne({ menus: id });
        // if (restaurant) {
        //   restaurant.menus = restaurant.menus.filter(
        //     (menuId) => menuId.toString() !== id
        //   );
        //   await restaurant.save();
        // }
        return res.status(200).json({
            success: true,
            message: "Menu deleted successfully",
            menu,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.menuController = {
    addMenu,
    editMenu,
    deletedMenu,
};
