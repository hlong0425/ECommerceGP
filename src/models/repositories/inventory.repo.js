import { Types } from 'mongoose';
import inventory from '../../models/inventory.model.js';
const insertInventory = async ({ productId, shopId, stock, location = 'unKnown' }) => {
    return await inventory.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shopId
    })
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: new Types.ObjectId(productId),
        inven_stock: { $gte: quantity }
    };

    const updateSet = {
        $inc: {
            inven_stock: -quantity,
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }

    const options = { upsert: true, new: true };

    return await inventory.updateOne(query, updateSet, options);
};

export {
    insertInventory,
    reservationInventory
};
