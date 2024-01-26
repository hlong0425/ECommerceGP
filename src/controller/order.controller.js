import { SUCCESS } from '../core/success.response.js';
import OrderService from '../services/order.service.js';

class OrderController {
    checkoutReview = async (req, res, next) => {
        new SUCCESS({
            message: 'Create discount generations',
            metadata: await OrderService.checkoutReview(req.body)
        }).send(res);
    };
}

export default new OrderController();
