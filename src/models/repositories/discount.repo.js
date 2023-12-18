import { getSelectData, unSelectData } from '../../utils/index.js';

const findAllDiscountCodesUnselect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unSelectData(unSelect))
        .lean()

    return discounts;
}

const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(unSelect))
        .lean()

    return discounts;
}

const checkDiscountExists = async ({
    model, filter
}) => {
    const foundDiscount = await model.findOne({
        discount_code: code,
        discount_shopId: toString(shopId)
    }).lean();

    return foundDiscount;
};

export {
    checkDiscountExists, findAllDiscountCodesSelect,
    findAllDiscountCodesUnselect
};
