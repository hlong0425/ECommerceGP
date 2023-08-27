import productService from '../services/product.service.js';
import { SUCCESS } from '../core/success.response.js';

class ProductController {
    createProduct = async(req, res, next) => {
        new SUCCESS({
            message: 'Create new Product sucess',
            metadata: await productService.createProduct(req.body.product_type, req.body)
        }).send(res);
    };
};

export default new ProductController();