import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import upload from "../../middlewares/multer";
import { menuController } from "./menu.controller";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  upload.single("imageFile"),
  menuController.addMenu
);
router.post(
  "/:id",
  isAuthenticated,
  upload.single("imageFile"),
  menuController.editMenu
);

router.delete("/:id", menuController.deletedMenu)

export const menuRouter = router;
