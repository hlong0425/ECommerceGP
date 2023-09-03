import ProductModel from '../models/product.model.js';
import { BadRequestError } from '../core/error.response.js';
import { 
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
} from '../models/repositories/product.repo.js';

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

    // ------------------------ PUT -------------------------------  
    static async publishProductByShop(product_shop, product_id) {
        return await publishProductByShop({product_shop, product_id});
    }

    static async unPublishProductByShop(product_shop, product_id) {
        return await unPublishProductByShop({product_shop, product_id});
    }

    // ------------------------END-PUT ----------------------------

    // ------------------------ QUERY -----------------------------

    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({query, limit, skip});
    };
   
    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({query, limit, skip});
    }

    static async searchProducts({keySearch}){
        return await searchProductByUser({ keySearch });
    }

    // ------------------------ END-QUERY -------------------------

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

    async createProduct(product_id) {
        return await ProductModel.product.create({
            ...this, _id: product_id
        });
    };
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

export default ProductFactory;