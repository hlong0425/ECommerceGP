import { Router } from 'express';
import cartControler from '../../controller/cart.controller.js';
const router = Router()

// authentication
// router.use(authenticationV2)


/**
 * @swagger
 *   /api/v1/cart:
 *     post:
 *       summary: Add product to cart
 *       tags: [Cart]
 *       security: [{apiKey: []}]
 *       requestBody:
 *          description: Request create cart
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestCreateCart'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Create cart response
 *           contents:
 *             application/json
 */
router.post('', cartControler.addToCart)

/**
 * @swagger
 *   /api/v1/cart:
 *     delete:
 *       summary: Delete item in cart
 *       tags: [Cart]
 *       security: [{apiKey: []}]
 *       requestBody:
 *          description: Request delete product in cart
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestDeleteCart'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Create cart response
 *           contents:
 *             application/json
 */
router.delete('', cartControler.delete)


/**
 * @swagger
 *   /api/v1/cart:
 *     put:
 *       summary: Update item in cart
 *       tags: [Cart]
 *       security: [{apiKey: []}]
 *       requestBody:
 *          description: Request update product in cart
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestUpdateCart'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Update cart response
 *           contents:
 *             application/json
 */
router.put('', cartControler.update)

/**
 * @swagger
 *   /api/v1/cart:
 *     get:
 *       summary: Get cart for user
 *       tags: [Cart]
 *       security: [{apiKey: []}]
 *       parameters:
 *         - in: query
 *           name: userId
 *           schema:
 *             type: string
 *           required: true
 *           description: userId of cart
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Cart info
 *           contents:
 *             application/json
 */
router.get('', cartControler.listToCart)

// router
export default router