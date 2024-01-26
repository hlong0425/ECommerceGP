import { SUCCESS } from '../core/success.response.js';
import InventoryService from '../services/inventory.service.js';

class InventoryController {
    addStock = async (req, res, next) => {
        new SUCCESS({
            message: 'Add stock success.',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res);
    };
}

export default new InventoryController();
