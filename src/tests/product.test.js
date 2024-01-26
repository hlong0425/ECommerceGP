import RedisPubSubService from '../services/redisPubSub.service.js';

class ProductServiceTest {
    static async purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        };

        console.log('order:>>>>', order)

        await RedisPubSubService.publisher('purchase_events', JSON.stringify(order))
    }
}

export default ProductServiceTest;