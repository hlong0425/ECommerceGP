import ProductSchema from '../models/product.model.js';
import { BadRequestError, ForbiddenError } from '../core/error.response.js';

class ProductFactory {
    /*
        type: 'Clothing'
    */
    static async createProduct( type, payload ) {
        switch(type) {
            case 'Electronics': return new Electronics(payload).createProduct();
            case 'Clothing': return new Clothing(payload).createProduct();
            default: 
                throw new BadRequestError(`Invalid Product Types ${type}`);
        }
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    };

    async createProduct() {
        return await ProductSchema.product.create(this);
    };
}   


// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await ProductSchema.clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('create new Clothing Error');

        const newProduct = await super.createProduct();
        if (!newClothing) throw new BadRequestError('create new Clothing Error');

        return newProduct;
    }
}

// Define sub-class for different product types Electronic
class Electronics extends Product {
    async createProduct() {
        const newClothing = await ProductSchema.electronics.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('create new Electronics Error');

        const newProduct = await super.createProduct();
        if (!newClothing) throw new BadRequestError('create new Clothing Error');

        return newProduct;
    }
}

export default  ProductFactory;