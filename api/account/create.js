const Account = require ('../../models/account/Account');

const express = require('express'),
      router = express.Router();


router.route('/create').post(async function (req, res, next) {
    const {email, name, age} = req.body;
    const account = new Account({email, name, age});
    await account.save();
    return res.send({message: 'success'});

    
});


module.exports = router;


// module.exports = async function (req, res, next) {
//     const {email, name, age} = req.body;
//     const account = new Account ({email, name, age});
//     await account.save();
//     return res.send({message: 'success'});
//
//
// };