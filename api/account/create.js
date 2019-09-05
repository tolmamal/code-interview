const utils = require("../../utils/utils");
const { HTTP_STATUSES } = utils;
const Account = require('../../models/account/Account');

const express = require('express'),
      router = express.Router();

const validator = require('validator');

const emailValidationMiddleware = async function(req, res, next){
    const {email} = req.body;

    if (email && validator.isEmail(email)) {
        next();
    }
    else {
        return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'email is NOT valid'});
    }
};

router.route('/create').post(emailValidationMiddleware, async function (req, res) {

    const {email, name, age} = req.body;
    const account = new Account({email, name, age});

    console.log('create was called');
    console.log({body: req.body});


    //check if email already exists
    Account.findOne({'email': email}, async function (err, data) {
        if (err) {
            return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);
        }
        if (data) {
            return res.status(HTTP_STATUSES.HTTP_BAD_INPUT).send({err: 'email already exists'});
        }
        else {
            try {
                await account.save();
                return res.status(HTTP_STATUSES.HTTP_OK).send({message: 'success'});
            }

            catch (err) {
                return res.status(HTTP_STATUSES.HTTP_SERVER_ERROR).send(err);

            }

        }

    });

});

module.exports = router;

