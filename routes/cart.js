const express = require('express');
const sequelize = require('../config/DBConfig');
const ensureAuthenticated = require('../helpers/auth');
const router = express.Router();
const Cart = require('../models/Cart');
const Catalog = require('../models/Catalog');
// const Sequelize = require('sequelize');


// shows the cart
router.get('/', ensureAuthenticated, (req, res) => {
	Cart.findAll({
		where: {
			cart_id: req.user.id,
			is_ordered: false,
		},
		raw: true
	})
	.then((cart) => {
		if (cart) {
			Cart.sum('items_price', {
				where: {
					cart_id: req.user.id,
					is_ordered: false
				}
			}).then(sum => {
				console.log(cart)
				res.render('cart/samplecart', {
					cart: cart,
					cart_total: sum,
					quantity_list: cart,
				})
			})
		} else {
			res.render('cart/samplecart', { 
				cart: cart,
			});
		}
	})
	.catch(err => console.log(err));
});

// from catalog items, it adds on to cart if item isnt in it yet,
// else, it updates by quantity
router.post('/add', ensureAuthenticated, (req, res) => {
	Cart.findOne({
		where: {
			cart_id: req.user.id,
			product_id: parseInt(req.body.product_id),
			is_ordered: false,
		}
	}).then((cart) => {
		if (cart) {
			Cart.update({
				quantity: sequelize.literal(' quantity + '+req.body.quantity),
				items_price: sequelize.literal(' quantity * '+req.body.product_price)
			}, {where: {
				cart_id: req.user.id,
				product_id: parseInt(req.body.product_id)			
			}})
			.then(()=>{
				res.redirect('/cart')
			})
		} else {
			Cart.create({
				cart_id: req.user.id,
				product_id: parseInt(req.body.product_id),
				product_name: req.body.product_name,
				product_price: parseFloat(req.body.product_price),
				product_imageURL: req.body.product_imageURL,
				product_URL: req.body.product_URL,
				quantity: parseInt(req.body.quantity),
				items_price: parseFloat(parseFloat(req.body.product_price) * parseInt(req.body.quantity)),
				is_ordered: false,
				order_id: null
			})
			.then(() => {
				res.redirect('/cart')
			})
		}
	})
	.catch((err) => {
		console.log(err);
	})
	



})

// Remove item from cart
router.get('/remove/:id', ensureAuthenticated, (req, res) => {
	Cart.destroy({
		where: {
			cart_id: req.user.id,
			product_id: parseInt((req.params.id).split('_').pop())
		}
	})
	.then(() => {
		res.redirect('/cart')
	})
})




module.exports = router;