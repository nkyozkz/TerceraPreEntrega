import { Router } from "express";
import cartsRouter from "../components/carts/routes.js";
import chatRouter from "../components/chats/routes.js";
import productsRouter from "../components/products/routes.js";
import sessionRouter from "../components/users/routes.js";
import ticketRouter from "../components/ticket/routes.js";
import handlebarsRouter from "../client/handlebarRoutes.js";

const router = Router();

router.use("/", handlebarsRouter);
router.use("/api/ticket", ticketRouter);
router.use("/api/sessions", sessionRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/chat", chatRouter);
router.use("/api/products", productsRouter);

export default router;
