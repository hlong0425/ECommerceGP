import { Types } from 'mongoose';
import productModel from '../../models/product.model.js'; 
import { BadRequestError } from '../../core/error.response.js';

const findAllDraftsForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
};

const findAllPublishForShop = async({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
};

const queryProduct = async({ query, limit, skip }) => {
    return await productModel.product.find(query)
            .populate('product_shop', 'name email -_id')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
};

const publishProductByShop = async({ product_shop, product_id }) => {
    const shop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    
    if(!shop) return null;

    if (shop.isPublished) throw new BadRequestError("This product is already published")

    shop.isDraft = false;
    shop.isPublished = true;

    await shop.save(); 

    return null;
};

const unPublishProductByShop = async({ product_shop, product_id }) => {
    const shop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });
    
    if(!shop) return null;

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
        .find(matchQuery, {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .lean()
};

export {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
}