const utils = require("../../utils/utils");
const {HTTP_STATUSES} = utils;

const Notification = require('../../models/notification/Notification');

const express = require('express'),
      router = express.Router();

router.route('/notifications').post(async function (req, res) {
    const {accountId, name, color} = req.body;
    const notification = new Notification({ accountId, name, color});

    //adds a notification to the DB
    Notification.findOne({'accountId': accountId}, async function (err, data) {
        if(err) {
            return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);
        }
        if (data) {
            // in case notification with accountId already exists
            return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'accountId already exists'});
        }
        else {
            try {
                //notification with accountId doesn't exist - save it in DB
                await notification.save();
                return res.status(HTTP_STATUSES.HTTP_OK).send({message: 'success'});
            }
            catch (err) {
                return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);
            }

        }
        
    });

});


//returns the notifications for given accountId (query param)
router.route('/notifications').get( async function (req, res) {
    let accountId = req.query.accountId;

    if(accountId && accountId.trim() !== "") {
        Notification.find({'accountId': accountId}, async function (err, data) {
            if(err){
                return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send(err);
            }
            if(data.length){
                return res.status(HTTP_STATUSES.HTTP_OK).send({'notification': data});
            }
            return res.status(HTTP_STATUSES.HTTP_NOT_FOUND).send(err);
        });

    }


    // in case there is no accountId provided in query
    else {
        return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'accountId is not provided'});

    }

});


//deletes notifications that contain color text and are only from specified account
router.route('/notifications').delete(async function (req, res) {

    let accountId = req.query.accountId;
    let color = req.query.color;


    if(accountId && color && accountId.trim() !== "" && color.trim() !== "" ) {
        try {
            let account = await Notification.findOneAndDelete({'accountId': accountId, 'color': color});
            if(account)
            {
                return res.status(HTTP_STATUSES.HTTP_OK).send({message: 'notification deleted'});
            }
            else
            {
                return res.status(HTTP_STATUSES.HTTP_NOT_FOUND).send({err: 'notification with account ID and color does NOT exist'});
            }

        }
        catch (err) {
            return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);

            
        }
    }
    else
    {
        return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'notification with account ID and/or color does NOT exist'});
    }
});


module.exports = router;