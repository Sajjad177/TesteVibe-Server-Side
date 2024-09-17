"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRouter = void 0;
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const menu_controller_1 = require("./menu.controller");
const router = express_1.default.Router();
router.post("/", isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), menu_controller_1.menuController.addMenu);
router.post("/:id", isAuthenticated_1.isAuthenticated, multer_1.default.single("imageFile"), menu_controller_1.menuController.editMenu);
router.delete("/:id", menu_controller_1.menuController.deletedMenu);
exports.menuRouter = router;
