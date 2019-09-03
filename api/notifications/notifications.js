const Notification = require('../../models/notification/Notification');

const express = require('express'),
      router = express.Router();

router.route('/notifications').post (async function (req, res, next) {
    const {accountId, name, color} = req.body;
    const notification = new Notification({accountId, name, color});

    Notification.findOne({'accountId': accountId}, async function (err, data) {
        if(err)
        {
            return res.status(500).send(err);
        }
        if (data)
        {
            return res.status(400).send({err: 'accountId already exists'});
        }
        else
        {
            await notification.save();
            return res.status(200).send({message: 'success'});
        }
        
    });

}

);

module.exports = router;