const Account = require ('../../models/account/Account');

const express = require('express'),
      router = express.Router();


router.route('/create').post(async function (req, res, next) {
    const {email, name, age} = req.body;
    const account = new Account({email, name, age});

    //check if email already exists
    account.findOne({'email': email}, async function (err, data) {
        if(err)
        {
            return res.status(500).send(err);
        }
        else if(data)
        {
            return res.status(400).send({err: 'email is not valid. already exists'});
        }
        else
        {
            await account.save();
            return res.status(200).send({message: 'success'});
        }
        
    });

    
});


module.exports = router;

