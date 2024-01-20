import { SUCCESS } from "../core/success.response.js";
import catchAsync from '../helpers/asyncHandler.js';
import CartService from "../services/cart.service.js";

/**
 * - Add product to cart - user
 * - Reduce product quantity by one - user
 * - increase product quantity by one - user
 * - get cart - user
 * - delete cart - user
 * - delete cart item - user
 */
class CartController {

    /**
     * @desc Add to cart for user
     *
     * @type {function(*, *, *): void}
     * @method POST
     * @url /api/v1/cart
     * @return {}
     */
    addToCart = catchAsync(async (req, res) => {
        new SUCCESS({
            message: 'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    })

    /**
     * @desc Update to cart for user
     *
     * @type {function(*, *, *): void}
     * @method PUT
     * @url /api/v1/cart
     * @return {}
     */
    update = catchAsync(async (req, res) => {
        new SUCCESS({
            message: 'Update to cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    })

    /**
     * @desc Delete item in cart for user
     *
     * @type {function(*, *, *): void}
     * @method DELETE
     * @url /api/v1/cart
     * @return {}
     */
    delete = catchAsync(async (req, res) => {
        new SUCCESS({
            message: 'Delete cart success',
            metadata: await CartService.deleteItemInCart(req.body)
        }).send(res)
    })

    /**
     * @desc Get cart for user
     *
     * @type {function(*, *, *): void}
     * @method GET
     * @url /api/v1/cart
     * @return {}
     */
    listToCart = catchAsync(async (req, res) => {
        new SUCCESS({
            message: 'List cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    })
}

export default new CartController()