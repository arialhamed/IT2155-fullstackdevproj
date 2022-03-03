const express = require('express');
const sequelize = require('../config/DBConfig');
const { setUpDB } = require('../config/DBConnection');
const router = express.Router();
const OrderDetails = require('../models/Orders');
const Cart = require('../models/Cart');

router.get('/showPayment', (req, res) => {
    OrderDetails.create({
        productID: 1,
        quantity: 5,
        total_price: 5.00
    })
    OrderDetails.create({
            productID: 2,
            quantity: 2,
            total_price: 9.00
    })
    .catch(err => console.log(err))
    res.render('cart/samplepayment');
});

module.exports = router;