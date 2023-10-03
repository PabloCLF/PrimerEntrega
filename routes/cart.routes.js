import { Router } from "express";
import { cartManager } from "../CartManager.js";
import { productManager } from "../ProductManager.js";
const router = Router();

router.get("/", async(req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get products from cart
router.get("/:cid", async(req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(+cid);
        const products = cart.products;
        if (!cart) {
            return res.status(400).json({ message: `Cart not found with id: ${cid}` });
        }
        res.status(200).json({ message: "Cart products found", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async(req, res) => {

    const { products } = req.body;
    if (!products) {
        return res.status(400).json({ message: "Products is missing" });
    }

    try {
        const response = await cartManager.addCart(products);
        res.status(200).json({ message: "Cart added", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:cid/product/:pid", async(req, res) => {

    const { cid, pid } = req.params;

    try {
        const cart = await cartManager.getCartById(+cid);
        if (!cart) {
            return res.status(400).json({ message: "Cart not found" });
        }

        const response = await cartManager.addProductOnCart(+cid, +pid);
        res.status(200).json({ message: "Product added on cart", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;