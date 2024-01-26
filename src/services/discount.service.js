import { BadRequestError, NotFoundError } from '../core/error.response.js';
import discountModel from '../models/discount.model.js';
import {
  checkDiscountExists,
  findAllDiscountCodesUnselect
} from '../models/repositories/discount.repo.js';
import { findAllProducts } from '../models/repositories/product.repo.js';
import { toObjectId } from '../utils/index.js';

/**
 * Discount Services:
 * 1 - Generate Discount Code
 * 2 - Get discount amount (user)
 * 3 - Get all discount code (user)
 * 4 - Verify discount code (user)
 * 5 - Delete discount code (admin)
 * 6 - Cancel discount code (user)
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code, start_date, end_date, is_active,
      shopId, min_order_value, product_ids, applies_to, name, description,
      type, value, max_value, max_uses, user_count, max_uses_per_user, users_used
    } = payload

    // kiem tra
    if (new Date() > new Date(start_date) || new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired')
    }

    // create index for discount code 
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: toObjectId(shopId),
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists')
    }

    const newDiscount = await discountModel.create({
      discount_shopId: shopId,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: user_count,
      discount_users_used: users_used,
      discount_max_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value | 0,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    })

    return newDiscount;
  };

  static async updateDiscount() {

  }

  static async getAllDiscountsWithProducts({
    code, shopId, page, limit
  }) {
    // create index for discount_code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: toObjectId(shopId),
    }).lean()

    console.log('foundDiscount', foundDiscount);

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('discount not exists');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: toObjectId(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products;
  }

  static async getAllDiscountCodesByShop({
    limit, page, shopId
  }) {
    const discounts = findAllDiscountCodesUnselect({
      model: discountModel,
      limit: +limit,
      page: page,
      filter: {
        discount_shopId: toObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId']
    });

    return discounts;
  }

  /**
   * Apply Discount Code:
   * products = [
   *   { 
   *      productId,
   *      shopId,
   *      quantity,
   *      name,
   *      price
   *   },
   *   { 
   *      productId,
   *      shopId,
   *      quantity,
   *      name,
   *      price
   *    }
   * ]
   */
  static async getDiscountAmount({
    code, userId, shopId, products
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: toObjectId(shopId),
        discount_is_active: true
      }
    })

    if (!foundDiscount) throw new NotFoundError("discount is not exist");

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_per_user,
      discount_users_used,
      discount_value,
      discount_type,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError("discount_expired!");
    }

    if (!discount_max_uses) {
      throw new NotFoundError("discount are out of range");
    }

    let totalOrder = products.reduce((acc, product) => {
      return acc + (product.price)
    }, 0)

    if (discount_min_order_value > 0) {
      // get total:
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`min order value is ${discount_min_order_value}`);
      }
    }

    if (discount_max_per_user > 0) {
      const currentDiscountUsed = await discount_users_used.find(user => user.id === userId) || [];
      if (currentDiscountUsed.length >= discount_max_per_user) throw new BadRequestError("has exceeded the number of discount uses.")
    }

    const amount = discount_type === "fixed_amount" ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder, // total order prices
      discount: amount, // price will be discount
      totalPrice: totalOrder - amount // total prices after discount
    }
  }

  static async deleteDiscount({ shopId, codeId }) {
    const deleted = discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: toObjectId(shopId)
    })

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: toObjectId(shopId)
      }
    })

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: -1,
        discount_uses_count: -1
      }
    })

    return result;
  }
}

export default DiscountService;
