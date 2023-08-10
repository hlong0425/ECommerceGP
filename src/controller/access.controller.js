import AccessService from '../services/access.service.js';

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[p]::signUp::`, req.body);
      /*
        200 OK
        201 CREATED
      */
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
