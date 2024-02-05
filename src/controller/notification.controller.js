import { SUCCESS } from '../core/success.response.js';
import { listNotiByUser } from '../services/notification.service.js';

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SUCCESS({
            metadata: await listNotiByUser(req.body)
        }).send(res);
    };
}

export default new NotificationController();
