'use strict';
import NotificationModel from '../models/notification.model.js';


const pushNotificationToSystem = async ({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content;

    if (type === 'SHOP-001') {
        noti_content = `@@@ đã thêm sản phẩm: @@@`
    }

    return await NotificationModel.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receivedId: receivedId,
        noti_option: options
    });
};

const listNotiByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = { noti_receivedId: userId };
    if (type !== 'ALL') {
        match['noti_type'] = type;
    };

    return await NotificationModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                noti_content: 1,
                createAt: 1
            }
        }
    ])
};


export { listNotiByUser, pushNotificationToSystem };

