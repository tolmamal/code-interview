import {HTTP_STATUSES} from "../../utils/utils";

const Account = require ('../../models/account/Account');

const express = require('express'),
      router = express.Router();

const validator = require('validator');

// read about middle ware validation and use it instead
router.route('/create').post(async function (req, res, next) {
    const {email, name, age} = req.body;
    const account = new Account({email, name, age});

    if(validator.isEmail(email)) {
        //check if email already exists
        Account.findOne({'email': email}, async function (err, data) {
            if(err) {
                return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);
            }
            if(data) {
                return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'email already exists'});
            }
            else {
                await account.save();
                return res.status(HTTP_STATUSES.HTTP_OK).send({message: 'success'});
            }

        });

    }
    //in case email address is not valid
    else {
        return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'email is NOT valid'});
    }



    
});


module.exports = router;

