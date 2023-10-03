// Consigna Clase 4 Product Manager
// Pablo Lugo Fares
import { existsSync, promises } from "fs";

class ProductManager {

    constructor(path) {
        this.path = path;
    }

    productCodeExists(code, products) {
        return products.some(product => product.code === code);
    }

    isProductValid(product) {
        let isProductValid = true;
        for (const [key, value] of Object.entries(product)) {
            if (!value) {
                console.log(`Product is missing ${key} property`);
                isProductValid = false;
            }
            return isProductValid;
        }
    }

    async getProducts() {

        try {
            if (existsSync(this.path)) {
                const productsFile = await promises.readFile(this.path, 'utf-8');
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }

    }

    async addProduct(product) {

        try {
            const products = await this.getProducts();
            const id = products.length ? products[products.length - 1].id + 1 : 1;

            const { title, description, price, thumbnail, code, stock } = product;

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log('Some data is missing')
                return
            }

            if (this.productCodeExists(code, products)) {
                console.log('Code is already used');
                return
            }

            products.push({ id, ...product });
            await promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return { id, ...product };

        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const productById = products.find(product => product.id === id);
            return productById ? productById : null;
        } catch (error) {
            return error;
        }

    }

    async updateProduct(id, updataData) {
        try {
            const products = await this.getProducts();
            const productToBeUpdated = products.find(product => product.id === id);
            const productIndex = products.findIndex(product => product.id === id);

            const updatedProduct = { id, ...productToBeUpdated, ...updataData };
            products[productIndex] = updatedProduct;
            await promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return updatedProduct;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id !== id);
            const productsFiltered = products.filter((product) => product.id !== id);
            await promises.writeFile(this.path, JSON.stringify(productsFiltered, null, 2));
            return product;
        } catch (error) {
            return error;
        }
    }
}

export const productManager = new ProductManager('products.json');