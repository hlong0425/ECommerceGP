import RedisPubSubService from '../services/redisPubSub.service.js';

class InventoryServiceTest {
    constructor() {

    };

    static subcribe() {
        console.log('subcribe')
        RedisPubSubService.subscriber('purchase_events', (message) => {
            console.log('message', message)
        })
    };
}

export default InventoryServiceTest