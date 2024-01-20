import { SUCCESS } from '../core/success.response.js';
import DiscountService from '../services/discount.service.js';

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SUCCESS({
            message: 'Create discount generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res);
    };

    getAllDiscountCodesByShop = async (req, res, next) => {
        const { limit, page } = req.query;

        new SUCCESS({
            message: 'success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                limit,
                page,
                shopId: req.user.userId
            })
        }).send(res);
    }

    getAllDiscountsWithProducts = async (req, res, next) => {
        const { code, shopId, page = 1, limit = 50 } = req.query;
        console.log('req.query', req.query);
        new SUCCESS({
            message: 'success',
            metadata: await DiscountService.getAllDiscountsWithProducts({
                code,
                shopId,
                page,
                limit
            })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        const { code, shopId, userId, products, } = req.body;
        new SUCCESS({
            message: 'success',
            metadata: await DiscountService.getDiscountAmount({
                code,
                shopId,
                userId,
                products
            })
        }).send(res);
    }
}

export default new DiscountController();
