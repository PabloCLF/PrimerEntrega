import { existsSync, promises } from "fs";
import { productManager } from "./ProductManager.js";

class CartManager {

    constructor(path) {
        this.path = path;
    }

    async areProductsValid(products) {
        try {
            const availableProducts = await productManager.getProducts();
            const availableIds = availableProducts.map(product => product.id);
            const valid = products.some(product => availableIds.includes(product.id));

            return valid;
        } catch (error) {
            return error;
        }


    }

    async addCart(products) {
        try {
            const carts = await this.getCarts();
            const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
            const areProductsValid = await this.areProductsValid(products);
            if (!areProductsValid) {
                return null;
            }

            const cart = { id: id, products: products };
            carts.push(cart);
            await promises.writeFile(this.path, JSON.stringify(carts));
            return cart;

        } catch (error) {
            return error;
        }
    }

    async getCarts() {
        try {
            if (existsSync(this.path)) {
                const cartsFile = await promises.readFile(this.path, 'utf-8');
                return JSON.parse(cartsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const cartById = carts.find(cart => cart.id === id);
            return cartById ? cartById : null;
        } catch (error) {
            return error;
        }
    }

    async addProductOnCart(cartId, productId) {

        const cart = await this.getCartById(cartId);
        if (!cart) {
            return null;
        }

        const product = await productManager.getProductById(productId);
        if (!product) {
            return null;
        }

        const productIndex = cart.products.findIndex(product => product.id === productId);

        if (productIndex < 0) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }

        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        carts[cartIndex] = cart;
        await promises.writeFile(this.path, JSON.stringify(carts));

        return cart;

    }
}

export const cartManager = new CartManager('carts.json');