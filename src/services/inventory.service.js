import { BadRequestError } from '../core/error.response.js';
import inventoryModel from '../models/inventory.model.js';
import { getProductById } from '../models/repositories/product.repo.js';


class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location }) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError('The product does not exists!');

        const query = {
            inven_shopId: shopId,
            invent_productId: productId
        };

        const updateSet = {
            $inc: {
                invent_stock: stock,
            },
            $set: {
                invent_location: location,
            },
        };

        const options = {
            upsert: true, new: true
        }

        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

export default InventoryService;
