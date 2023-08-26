import AccessService from '../services/access.service.js';
import { CREATED, SUCCESS } from '../core/success.response.js';
class AccessController {
  logout = async (req, res, next) => {
    new SUCCESS({
      message: 'Logout success',
      metadata: await AccessService.Logout({keyStore: req.keyStore})
    }).send(res);
  };

  login = async (req, res, next) => {
    new SUCCESS({
      metadata: await AccessService.login(req.body)
    }).send(res);
  };

  signUp = async (req, res, next) => {
    /*
      200 OK
      201 CREATED
    */
    new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    new SUCCESS({
      message: 'Get token success',
      metadata: await AccessService.handlerRefeshToken(req.body.refreshToken),
    }).send(res);
  }
}

export default new AccessController();
