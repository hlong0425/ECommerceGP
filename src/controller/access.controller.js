import AccessService from '../services/access.service.js';
import { CREATED } from '../core/success.response.js';
class AccessController {
  signUp = async (req, res, next) => {
    try {
      /*
        200 OK
        201 CREATED
      */
      new CREATED({
        message: 'Register OK!',
        metadata: await AccessService.signUp(req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
