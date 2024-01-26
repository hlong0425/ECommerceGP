import { BadRequestError } from '../core/error.response.js';
import order from '../models/order.model.js';
import { findCartById } from '../models/repositories/cart.repo.js';
import { checkProductByServer } from '../models/repositories/product.repo.js';
import DiscountService from '../services/discount.service.js';
class OrderService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            code
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
     */
    static checkoutReview = async ({
        cartId, userId, shop_order_ids
    }) => {
        const shop_order_ids_new = [];
        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien giam gia
            totalCheckout: 0 // tong thanh toan
        };

        // check cartId exists
        const foundCart = findCartById(cartId)
        if (!foundCart) throw new BadRequestError(`Cart don't exists`);

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            if (checkProductServer.length <= 0) throw new Error('Order invalid');

            // sum total order
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // total before
            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRow: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai > 0, check valid
            if (shop_discounts.length > 0) {
                const { totalPrice, discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId,
                    shopId,
                    products: checkProductServer
                });

                if (discount > 0) {
                    checkout_order.totalDiscount += discount
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static orderByUser = async ({
        shop_order_ids,
        cartId,
        userId,
        user_address: { },
        user_payment: { },
    }) => {
        const { shop_order_ids_new, checkout_order } = this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        });

        const acquireProduct = [];


        // Kiểm tra product có tồn kho hay không. 
        const products = shop_order_ids_new.flatMap(order => order.item_products);

        for (let product in products) {
            const { productId, quantity } = product;
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // check if co 1 san pham het han trong kho.
        if (acquireProduct.includes(false)) throw new BadRequestError('Mot so san pham da het, vui long quay lai gio hang...');

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        });

        // Neu order thanh cong, remove product da order trong cart.
        if (newOrder) {
            // remove product in my cart.
        }

        return newOrder;
    }
}

export default OrderService;
