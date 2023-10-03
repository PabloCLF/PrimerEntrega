import { Router } from "express";
import { productManager } from "../ProductManager.js";
const router = Router();

router.get("/", async(req, res) => {
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;
        const filteredProducts = products.slice(0, limit);
        res.status(200).json({ message: "Products found", products: filteredProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async(req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getProductById(+id);
        if (!product) {
            return res.status(400).json({ message: `Product not found with id: ${id}` });
        }
        res.status(200).json({ message: "Product found", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async(req, res) => {

    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Data is missing" });
    }

    try {
        const response = await productManager.addProduct(req.body);
        res.status(200).json({ message: "Product added", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:pid", async(req, res) => {
    const { pid } = req.params;

    try {
        const response = await productManager.deleteProduct(+pid);
        if (!response) {
            return res.status(404).json({ message: `Product not found with id: ${pid}` });
        }
        res.status(200).json({ message: "Product removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:pid", async(req, res) => {
    const { pid } = req.params;
    try {
        const response = await productManager.updateProduct(+pid, req.body);
        if (!response) {
            return res.status(404).json({ message: `Product not found with id: ${pid}` });
        }
        res.status(200).json({ message: "Product updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;