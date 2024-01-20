import { BadRequestError } from '../core/error.response.js';
import cartModel from '../models/cart.model.js';
import { getProductById } from '../models/repositories/product.repo.js';
/**
 *  Key feature: Cart Service:
 *  - add product to card [user]
 *  - reduce, incre product quantity [user]
 *  - get cart [user]
 *  - delete card item [user]
 */

class CartService {
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_user_id: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: { // increment
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async createUserCart({ userId, product }) {
        const query = {
            cart_user_id: userId,
            cart_state: 'active'
        };

        if (!product) throw new BadRequestError('Product is required');

        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, {
            upsert: true,
            new: true,
        })
    }

    static async addToCart({
        userId, product = {}
    }) {
        const cart = await cartModel.findOne({
            cart_user_id: userId
        })

        if (!cart) {
            // create cart for User
            return await CartService.createUserCart({ userId, product })
        }

        // neu co gio hang roi nhung chua co san pham nao
        if (!cart.cart_products.length) {
            cart.cart_products = [product]
            return await cart.save()
        }

        // gio hang ton tai, va co san pham nay thi update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }


    /**
     * @param {userId, shop_order_ids}: { 001, shop_order_ids: [
     *  { 
     *      shopId, 
     *      items_products: [
     *          quantity: 0,
     *          price: 124,
     *          shopId: '',
     *          old_quantity: '1',
     *          productId: '',
     *      ]
     *  }
     * ]} 
     * @returns 
     */
    static async addToCartV2({ userId, shop_order_ids = [] }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.items_products[0]

        // check product 
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new BadRequestError('Product not found')

        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new BadRequestError('Product do not belong to the shop')
        }

        if (quantity === 0) {
            // todo deleted
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemInCart({ userId, productId }) {
        const query = { cart_user_id: userId, cart_state: 'active' }
        const updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        return await cartModel.updateOne(query, updateSet)
    }

    static async getListUserCart({ userId }) {
        const cart = await cartModel.findOne({
            cart_user_id: +userId
        }).lean();

        return cart;
    }
}

export default CartService;
