const express = require('express');
const router = express.Router();
const moment = require('moment');
const Order = require('../models/Orders');
const Cart = require('../models/Cart');
const Catalog = require('../models/Catalog')
const Refunds = require('../models/Refunds');
const session = require('express-session');

// For sequelize querying
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Flash Messenger
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");
const sequelize = require('../config/DBConfig');

router.get('/', ensureAuthenticated, (req, res) => {
    let admin_nos = [1];
    let is_admin = () => {try{if (admin_nos.includes(req.user.id)){return true} else {return false}} catch {return false}}
    if (is_admin()) {
        Order.findAll({raw:true}).then((orders) => {
            for (var i=0; i<orders.length; i++){
                let temp = [{active: "", logo: "check", title: "Order received"},
                            {active: "", logo: "truck", title: "Shipped"},
                            {active: "", logo: "box", title: "Delivered"},]
                if (orders[i].delivery_status == "Order Received") {
                    temp[0].active = "active"
                } else if (orders[i].delivery_status == "Shipped") {
                    temp[0].active = "active";
                    temp[1].active = "active";
                } else if (orders[i].delivery_status == "Delivered") {
                    temp[0].active = "active"
                    temp[1].active = "active"
                    temp[2].active = "active"
                }
                orders[i]["step"] = temp;
                // orders[i]["is_refunding"] = false;
                // orders[i]["is_refunding"] = ((id) => 
                //     Refunds.count({
                //         where: {id},
                //         raw: true
                //     })
                //     .then(count => {
                //         // console.log(refunds)
                //         return (count > 0) ? true : false
                //     }).catch((err) => {console.log(err)}))(orders[i].order_id)
                
                // var temp2 = function(id){
                //     return Refunds.findOne({
                //         where: {id},
                //         raw: true
                //     })
                //     .then((refunds) => {
                //         if (refunds) {
                //             return true
                //         } else {
                //             return false
                //         }
                // })};
                // (async function(){
                //     orders[i]["is_refunding"] = await temp2(orders[i].order_id)
                    
                // })()
                
                // console.log(temp2) 
                // console.log(orders[i]["is_refunding"])
            }
            res.render('orders/orders', {
                orders: orders,
                is_admin: is_admin
            })
        })
    } else {
        Order.findAll({
            where: {
                cart_id: req.user.id
            },
            raw: true
        }).then((orders) => {
            for (var i=0; i<orders.length; i++){
                let temp = [{active: "", logo: "check", title: "Order received"},
                            {active: "", logo: "truck", title: "Shipped"},
                            {active: "", logo: "box", title: "Delivered"},]
                if (orders[i].delivery_status == "Order Received") {
                    temp[0].active = "active"
                } else if (orders[i].delivery_status == "Shipped") {
                    temp[0].active = "active";
                    temp[1].active = "active";
                } else if (orders[i].delivery_status == "Delivered") {
                    temp[0].active = "active"
                    temp[1].active = "active"
                    temp[2].active = "active"
                }
                orders[i]["step"] = temp;
                // orders[i]["is_refunding"] = Refunds.findOne({
                //     where: {order_id: orders[i].order_id},
                //     raw: true
                // }).then((refunds) => {
                //     if (refunds){
                //         return true
                //     } else {
                //         return false
                //     }
                // }).catch((err) => {console.log(err)})
            }
            res.render('orders/orders', {
                orders: orders,
            })
        })
    }
})

router.post('/submit', ensureAuthenticated, (req, res) => {
    let order_id = Math.floor(Math.random() * (Math.floor(9999999) - Math.ceil(1000000)) + Math.ceil(1000000));
    // Updates cart items order values
    Cart.update({
        is_ordered: true,
        order_id: order_id
    }, {where: {
        is_ordered: false,
        cart_id: req.user.id
    }}).then(() => {
        // Gets cart details from order_id
        Cart.findAll({
            where: {
                order_id: order_id
            },
            raw: true
        }).then((cart_details) => {
            // and creates new Order, with cart_details from Cart
            Order.create({
                order_id: order_id,
                cart_id: req.user.id,
                total_price: req.body.cart_total,
                // Order Received, Shipped, Delivered
                delivery_status: 'Order Received',
                // Default delivery: a week from date made order 
                delivery_date_est: moment().add(7, 'days').toDate(),
                shipping: "ABC Default Delivery",
                cart_details: cart_details
            })
        })

        // Find cart items where it was ordered
        Cart.findAll({
            attributes: ['quantity', 'product_id'],
            where:{
                cart_id: req.user.id,
                order_id: order_id,
            },
            raw: true,
        }).then((cart) => {
            for (var i=0; i < cart.length; i++){
                // and goes through each item (should be unique, with product_id), and update via quantity
                Catalog.update({
                    product_stock: sequelize.literal(' product_stock - '+cart[i]['quantity']),
                    product_stocksold: sequelize.literal(' product_stocksold + '+cart[i]['quantity'])
                }, {where: {
                    product_id: parseInt(cart[i]['product_id']),
                    
                }})
            }
        })
        res.redirect('/orders')
    })
})

router.post('/updateDelivery', ensureAuthenticated, (req, res) => {
    Order.findOne({
        where: {order_id: parseInt(req.body.order_id)},
        raw: true
    }).then((order) => {
        let deliver_status_change = "Delivered";
        if (order.delivery_status == "Order Received"){
            deliver_status_change = "Shipped"
        } else if (order.delivery_status == "Shipped"){
            deliver_status_change = "Delivered"
        }
        Order.update({
            delivery_status: deliver_status_change
        }, {where: {
            order_id: parseInt(req.body.order_id)
        }})
        res.redirect('/orders')
    })
})

module.exports = router;