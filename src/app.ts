import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { UserRouters } from "./modules/user/user.route";
import { RestaurantRouter } from "./modules/restaurant/restaurant.route";

const app = express();

// setup parser
app.use(bodyParser.json({ limit: "10mb" })); //added limit data -> 10mb
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

//corse setup :
const corsOptions = {
  origin: "http://localhost:8000",
  credentials: true,
};
app.use(cors(corsOptions));

//router
app.use("/api/v1/user", UserRouters);
app.use("/api/v1/restaurant", RestaurantRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! The food server is running");
});

export default app;
