  
const router = require('express').Router();
const ensureAuthenticated = require("../helpers/auth");
const alertMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const UserAddress = require('../models/UserAddress');
const UserCard = require('../models/UserCard');

router.get('/', ensureAuthenticated, async function(req, res, next) {
    primary_card = await UserCard.findOne({ where: {email: req.user.email, primary: true} });
    primary_address = await UserAddress.findOne({ where: {email: req.user.email, primary: true} });

    address = "No address added";
    card_num = "No card added";

    if (primary_address != null) { address = primary_address.address };
    if (primary_card != null) { card_num = primary_card.card_num };

    res.render('account/dash_main', { userinfo: { primary_address: address, primary_card: card_num}, layout: 'dash'});
});

router.get('/cards', ensureAuthenticated, async function(req, res, next) {
    cards = await UserCard.findAll({where:{email: req.user.email}}); console.log(cards);
    res.render('account/dash_cards', { cards: cards, layout: 'dash'});
});

router.get('/addresses', ensureAuthenticated, async function(req, res, next) {
    addresses = await UserAddress.findAll({where: {email: req.user.email}});
    res.render('account/dash_addresses', { addresses: addresses, layout: 'dash'});
});

router.post('/editName', ensureAuthenticated, async function(req, res, next) {
    if (req.body.newName == "") {
        alertMessage(res, 'danger', 'Please fill in a name', '', true);
        res.redirect('./');
    }
    await User.update({ name: req.body.newName }, { where : { email: req.user.email } });
    alertMessage(res, 'success', 'Name successfully changed', '', true);
    res.redirect('./');
});

router.post('/changePassword', ensureAuthenticated, async function(req, res, next) {
    if (req.body.newPass1 != req.body.newPass2) {
        alertMessage(res, 'warning', 'Passwords should match', '', true);
        return res.redirect('./');
    }

    if (req.body.newPass1 == "") {
        alertMessage(res, 'danger', 'Please fill in a password', '', true);
        return res.redirect('./');
    }

    // Checks that password length is more than 4
    if (req.body.newPass1.length < 4) {
        alertMessage(res, 'warning', 'Password must be more than 4 characters', '', true);
        return res.redirect('./')
    }

    bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(req.body.newPass1, salt, async (err, hash) => {
             await User.update({ password: hash }, { where : { email: req.user.email } });
        })
    })
    alertMessage(res, 'success', 'Password successfully changed', '', true);
    res.redirect('./');
});

router.post('/addAddress', ensureAuthenticated, async function(req, res, next) {
    if (req.body.nick == "") {
        alertMessage(res, 'warning', 'Please enter a nickname', '', true);
        return res.redirect('../addresses');
    }

    if (req.body.address == "") {
        alertMessage(res, 'warning', 'Please enter an address', '', true);
        return res.redirect('../addresses');
    }

    await UserAddress.create({
        email: req.user.email,
        address: req.body.address,
        nick: req.body.nick
    });

    alertMessage(res, 'success', 'Address Added!', '', true);
    res.redirect('addresses')
});

router.post('/addCard', ensureAuthenticated, async function(req, res, next) {
    if (req.body.cvv == "") {
        alertMessage(res, 'warning', 'Please enter your cvv', '', true);
        return res.redirect('cards')
    }

    if (req.body.nick == "") {
        alertMessage(res, 'warning', 'Please enter a nickname', '', true);
        return res.redirect('cards')
    }

    if (req.body.num == "") {
        alertMessage(res, 'warning', 'Please enter your number', '', true);
        return res.redirect('cards')
    }

    if (req.body.exp_date == "") {
        alertMessage(res, 'warning', 'Please enter your card\'s expiration date', '', true);
        return res.redirect('cards')
    }

    await UserCard.create({
        email: req.user.email,
        exp_date: req.body.exp_date,
        card_num: req.body.num,
        cvv: req.body.cvv,
        nick: req.body.nick
    });

    alertMessage(res, 'success', 'Card Added!', '', true);
    res.redirect('../cards')
});

router.get('/removeCard/:cardId', ensureAuthenticated, async function(req, res, next) {
    await UserCard.destroy({where: {
        email: req.user.email,
        id: req.params.cardId,
    }});
    res.redirect('../cards')
})

router.get('/removeAddress/:addressId', ensureAuthenticated, async function(req, res, next) {
    await UserAddress.destroy({where: {
        email: req.user.email,
        id: req.params.addressId,
    }});
    res.redirect('../addresses')
})

router.get('/makePrimaryCard/:cardId', ensureAuthenticated, async function(req, res, next) {
    await UserCard.update({primary: false}, {where: {email: req.user.email}});
    await UserCard.update({primary: true}, {where: {
        email: req.user.email,
        id: req.params.cardId,
    }});
    res.redirect('../cards')
})

router.get('/makePrimaryAddress/:addressId', ensureAuthenticated, async function(req, res, next) {
    await UserAddress.update({primary: false}, {where: {email: req.user.email}});
    await UserAddress.update({primary: true}, {where: {
        email: req.user.email,
        id: req.params.addressId,
    }});
    res.redirect('../addresses')
})



module.exports = router;