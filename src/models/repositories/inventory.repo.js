import { Types } from 'mongoose';
import inventory from '../../models/inventory.model.js'; 
import { BadRequestError } from '../../core/error.response.js';
import { getSelectData, unSelectData } from '../../utils/index.js';

const insertInventory = async({ productId, shopId, stock, location = 'unKnown' }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock, 
        inven_location: location,
        inven_shopId: shopId 
    })
};

export {
    insertInventory,
}