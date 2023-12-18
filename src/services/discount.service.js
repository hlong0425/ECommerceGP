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
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
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
  };

  static async updateDiscount() {

  }

  static async getAllDiscountsWithProducts({
    code, shopId, userId, page, limit
  }) {
    // create index for discount_code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: toObjectId(shopId),
    }).lean()

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

  static async getDiscountAmount({
    codeId, userId, shopId, products
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
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError("discount_expired!");
    }

    if (!discount_max_uses) {
      throw new NotFoundError("discount are out of range");
    }
  }
}

export default DiscountService;
