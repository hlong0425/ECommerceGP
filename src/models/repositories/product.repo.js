import { Types } from 'mongoose';
import { BadRequestError } from '../../core/error.response.js';
import productModel from '../../models/product.model.js';
import { getSelectData, unSelectData } from '../../utils/index.js';

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
};

const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
};

const publishProductByShop = async ({ product_shop, product_id }) => {
    const shop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!shop) return null;

    if (shop.isPublished) throw new BadRequestError("This product is already published")

    shop.isDraft = false;
    shop.isPublished = true;

    await shop.save();

    return null;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const shop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!shop) return null;

    if (!shop.isPublished) throw new BadRequestError("This product is already unpublished")

    shop.isDraft = true;
    shop.isPublished = false;

    await shop.save();

    return null;
};

const searchProductByUser = async ({ keySearch }) => {
    const matchQuery = {
        isPublished: true,
        $text: { $search: new RegExp(keySearch) },
    }

    return await productModel.product
        .find(matchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
};

const findAllProducts = async ({ limit, sort, pageNo, select, filter }) => {
    const skip = (pageNo - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 } // -1: Highest values first
    const products = await productModel.product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();
    console.log(products);
    return products;
}

const findProduct = async ({ product_id, unSelect = [] }) => {
    return await productModel.product.findById(product_id).select(unSelectData(unSelect));
};

const getProductById = async (id) => {
    return await productModel.product.findOne({ _id: new Types.ObjectId(id) }).lean()
}


/**
 * 
 * @param {*} products 
 * @returns {{price: number, quantity: number, productId: number}[]}
 */
const checkProductByServer = async (products) => {
    return await Promise.all(
        products.map(async product => {
            const foundProduct = await getProductById(product.productId)
            if (foundProduct) {
                return {
                    price: foundProduct.product_price,
                    quantity: product.quantity,
                    productId: product.productId
                }
            }
        })
    )
}

export {
    checkProductByServer, findAllDraftsForShop,
    findAllProducts,
    findAllPublishForShop,
    findProduct, getProductById, publishProductByShop,
    searchProductByUser,
    unPublishProductByShop
};

