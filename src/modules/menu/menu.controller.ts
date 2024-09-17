import { Request, response, Response } from "express";
import uploadImageOnCloudinary from "../../utils/imageUpload";
import { Menu } from "./menu.model";
import { Restaurant } from "../restaurant/restaurant.model";
import mongoose from "mongoose";
// import { IMenuDocument } from "./menu.interface";

// Define a type for the menu payload (incoming data)
// type IMenuPayload = {
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// };


const addMenu = async (req: Request, res: Response) => {
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
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

    const menu : any = await Menu.create({
      name,
      description,
      price, 
      image: imageUrl,
    });

    const restaurant = await Restaurant.findOne({ user: req.id });

    if (restaurant) {
      (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
      // restaurant.menus.push(menu._id);
      await restaurant.save();
    }

    return res.status(201).json({
      success: true,
      message: "Menu added successfully",
      menu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const file = req.file;
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found!",
      });
    }
    if (name) menu.name = name;
    if (description) menu.description = description;
    if (price) menu.price = price;

    //checking image exist in cloudinary
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      menu.image = imageUrl;
    }
    // updated menus
    await menu.save();
    return res.status(201).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletedMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found!",
      });
    }

    await menu.deleteOne();

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const menuController = {
  addMenu,
  editMenu,
  deletedMenu,
};
