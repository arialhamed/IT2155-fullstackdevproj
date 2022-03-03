const express = require('express');
const ensureAuthenticated = require('../helpers/auth');
const Refunds = require('../models/Refunds');
const router = express.Router();
const Refund = require('../models/Refunds');

router.get('/_:id', (req, res) => {
        res.render('refunds/refunds', {
            order_id: parseInt(req.params.id)
        });
});

router.post('/request', ensureAuthenticated, (req, res) => {
    let refund_id = Math.floor(Math.random() * (Math.floor(999999) - Math.ceil(100000)) + Math.ceil(100000));
    let order_id = parseInt(req.body.order_id);
    let cart_id = req.user.id
    let reason = req.body.reason;
    let description = req.body.description;

    // Multi-value components return array of strings or undefined
    Refund.create({
        refund_id,
        order_id,
        cart_id,
        reason,
        description
    })
    .then((refunds) => {
        res.redirect('/orders'); 
        // redirect to call router.get(/listVideos...) to retrieve all updated videos
    })
    .catch(err => console.log(err))
});

router.get('/showAll', ensureAuthenticated, (req, res) => {
    let admin_nos = [1];
    let is_admin = () => {try{if (admin_nos.includes(req.user.id)){return true} else {return false}} catch {return false}}
    if (is_admin){
        console.log("ADMIN")
        Refunds.findAll().then((refunds) => {
            res.render('refunds/readrefunds', {
                refunds: refunds

            })
        })
    } else {
        console.log("NOTADMIN")
        res.redirect("/orders")
    }
})

module.exports = router;