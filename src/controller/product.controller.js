import productServiceV2 from '../services/product.service.v2.js';
import { SUCCESS } from '../core/success.response.js';

class ProductController {
    createProduct = async(req, res, next) => {
        new SUCCESS({
            message: 'create new product sucess',
            metadata: await productServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    };

    publishProductByShop = async(req, res, next) => {
        await productServiceV2.publishProductByShop(req.user.userId, req.params.id);
        
        new SUCCESS({
            message: 'product published successfully',
        }).send(res);
    }

    unPublishProductByShop = async(req, res, next) => {
        await productServiceV2.unPublishProductByShop(req.user.userId, req.params.id);
        
        new SUCCESS({
            message: 'product unpublished successfully',
        }).send(res);
    }

    // Query
    /**
     * @desc: Get all drafts for shop
     * @param {{limit, }} req 
     * @param {*} res 
     * @returns { JSON }
     */
    findAllDraftForShop = async(req, res, next) => {
        new SUCCESS({
            message: "success",
            metadata: await productServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
                limit: 50,
                skip: 0
            })
        }).send(res)
    }

    /**
     * @desc: Get all drafts for shop
     * @param {{limit, }} req 
     * @param {*} res 
     * @returns { JSON }
     */
    findAllPublishForShop = async(req, res, next) => {
        new SUCCESS({
            message: "success",
            metadata: await productServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
                limit: 50,
                skip: 0
            })
        }).send(res)
    }

    getListSearchProduct = async(req, res, next) => {
        new SUCCESS({
            message: "success",
            metadata: await productServiceV2.searchProducts({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }

    // End Query
};

export default new ProductController();