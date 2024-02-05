import { BadRequestError } from '../core/error.response.js';
import ProductModel from '../models/product.model.js';
import {
    findAllDraftsForShop,
    findAllProducts,
    findAllPublishForShop,
    findProduct,
    publishProductByShop,
    searchProductByUser,
    unPublishProductByShop
} from '../models/repositories/product.repo.js';

import { insertInventory } from '../models/repositories/inventory.repo.js';
import { removeUndefinedObject, updateNestedObjectParser } from '../utils/index.js';
import { pushNotificationToSystem } from './notification.service.js';

import { Types } from 'mongoose';
import productModel from '../models/product.model.js';


/**
 * 
 * Main flow: 1. ProductFactory -> Clothing -> Product
 * 
 */

class Product {
    constructor({
        product_id,
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_id = product_id;
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    };

    async createProduct(product_id) {
        const newProduct = await ProductModel.product.create({
            ...this, _id: product_id
        });

        await insertInventory({
            productId: newProduct._id,
            shopId: this.product_shop,
            stock: this.product_quantity
        });

        pushNotificationToSystem({
            type: 'SHOP-001',
            receivedId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop
            }
        }).then(rs => console.log(rs)).catch(() => console.log('Notification error'));

        return newProduct;
    };

    async updateProduct(product_id, body) {
        return await ProductModel.product.findByIdAndUpdate(product_id, body, {
            new: true
        })
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await ProductModel.clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError('create new Clothing Error');

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('create new Clothing Error');

        return newProduct;
    }

    async updateProduct(product_id, product_shop) {
        const productBody = this;

        if (productBody.product_attributes) {
            // update child
            const { matchedCount } = await productModel.clothing.updateOne({
                _id: new Types.ObjectId(product_id)
            }, removeUndefinedObject(productBody.product_attributes), {
                new: true
            });

            if (matchedCount === 0) throw new BadRequestError("can't not update")
        }

        return await super.updateProduct(product_id, productBody);
    }
}

// Define sub-class for different product types Electronic
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await ProductModel.electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronics) throw new BadRequestError('create new Electronics Error');

        const newProduct = await super.createProduct(newElectronics._id);
        if (!newProduct) throw new BadRequestError('create new Clothing Error');

        return newProduct;
    }
}

class ProductFactory {
    /*
        type: 'Clothing'
    */
    static _productRegistery = {
        Electronics,
        Clothing
    };

    static async createProduct(type, payload) {
        const productInstance = this._productRegistery[type];
        if (!productInstance) throw new BadRequestError(`Invalid Product Types ${type}`);

        return new productInstance(payload).createProduct();
    }

    // ------------------------ PUT -------------------------------  

    static async updateProduct({
        product_id, product_shop, body
    }) {
        if (!body.product_type) {
            throw new BadRequestError(`product_type is required`);
        }

        const productInstance = this._productRegistery[body.product_type];
        if (!productInstance) {
            throw new BadRequestError(`invalid product type ${body.product_type}`);
        }
        console.log("-------- START ------------");

        const updatedRequest = updateNestedObjectParser(body);
        console.log("updatedRequest >>", updatedRequest);

        console.log("-------- END ------------");

        return new productInstance(body).updateProduct(product_id, product_shop)
    }

    static async publishProductByShop(product_shop, product_id) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop(product_shop, product_id) {
        return await unPublishProductByShop({ product_shop, product_id });
    }

    // ------------------------END-PUT ----------------------------

    // ------------------------ QUERY -----------------------------

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    };

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', pageNo = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit, sort, filter, pageNo,
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] });
    }

    // ------------------------ END-QUERY -------------------------
}

export default ProductFactory;