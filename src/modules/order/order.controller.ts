import { Request, Response } from "express";
import { Restaurant } from "../restaurant/restaurant.model";
import { Order } from "./order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckOutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createCheckOutSession = async (req: Request, res: Response) => {
  try {
    const checkOutSessionRequest: CheckOutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(
      checkOutSessionRequest.restaurantId
    ).populate("menu");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const order = new Order({
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
    const session = await stripe.checkout.sessions.create({
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
        images: JSON.stringify(menuItems.map((item: any) => item.image)),
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Error while creating section",
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createLineItems = (
  checkOutSessionRequest: CheckOutSessionRequest,
  menuItems: any
) => {
  //1. create line items
  const lineItems = checkOutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item: any) => item._id === cartItem.menuId
    );
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

export const orderController = {
  createCheckOutSession,
  getOrders,
};
