import {HTTP_STATUSES} from "../../utils/utils";

const Notification = require('../../models/notification/Notification');

const express = require('express'),
      router = express.Router();

router.route('/notifications').post (async function (req, res, next) {
    const {accountId, name, color} = req.body;
    const notification = new Notification({accountId, name, color});

    //check if accountId already exists in DB
    Notification.findOne({'accountId': accountId}, async function (err, data) {
        if(err) {
            return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);
        }
        if (data) {
            return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'accountId already exists'});
        }
        else {
            await notification.save();
            return res.status(HTTP_STATUSES.HTTP_OK).send({message: 'success'});
        }
        
    });

}

);






module.exports = router;