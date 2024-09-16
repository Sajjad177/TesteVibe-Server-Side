import { Request, Response } from "express";
import uploadImageOnCloudinary from "../../utils/imageUpload";
import { Order } from "../order/order.model";
import { Restaurant } from "./restaurant.model";

const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;
    // checking user have any restaurant
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      return res.status(400).json({
        success: false,
        message: "Already have a Restaurant",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      // price,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.find({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.restaurantName = restaurantName;
    restaurant.city = city;
    restaurant.country = country;
    restaurant.deliveryTime = deliveryTime;
    restaurant.cuisines = JSON.parse(cuisines);

    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      massage: "Restaurant updated",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");
    //The populate method in Mongoose is used to replace the specified paths in a document with documents from other collections.
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchText = req.params.searchText || "";
    const searchQuery = req.query.searchQuery || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter((cuisine) => cuisine);

    // search with query
    const query: any = {};
    // basic search based on searchText (name, city, country)
    if (searchText) {
      // Insert in query
      query.$or = [
        { restaurantName: { $regex: searchText, $options: "i" } },
        { city: { $regex: searchText, $options: "i" } },
        { country: { $regex: searchText, $options: "i" } },
      ];
    }

    // filter on the basic of searchQuery ->
    if (searchQuery) {
      query.$or = [
        { restaurantName: { $regex: searchText, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } },
      ];
    }
    // console.log("testing query -> ", query);

    if (selectedCuisines.length > 0) {
      query.cuisine = { $in: selectedCuisines };
    }

    const restaurants = await Restaurant.find(query);
    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { createdAt: -1 },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const RestaurantController = {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  getRestaurantOrder,
  updateOrderStatus,
  searchRestaurant,
  getSingleRestaurant,
};
