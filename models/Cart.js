"use strict";

const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
// const Catalog = require('./Catalog');


/* 	Creates a user(s) table in MySQL Database. 
	Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Cart = db.define('cart', { 	
	cart_id: {
		type: Sequelize.INTEGER
	},
	product_id: {
		type: Sequelize.INTEGER
	},
	product_name: {
		type: Sequelize.STRING
	},
	product_price: {
		type: Sequelize.FLOAT
	},
	product_imageURL: {
		type: Sequelize.STRING
	},
	product_URL: {
		type: Sequelize.STRING
	},
	quantity: {
		type: Sequelize.INTEGER
	},
	items_price: {
		type: Sequelize.FLOAT
	},
	is_ordered: {
		type: Sequelize.BOOLEAN
	},
	order_id: {
		type: Sequelize.INTEGER
	}
	
});

// Cart.associate = (models) => {
// 	Cart.belongsTo(models.Orders, {
// 		foreignKey: "cart_id"
// 	})
// }

// Cart.associate = (models) => {
// 	Cart.hasMany(models.Catalog, {
// 		as: "catalog",
// 		foreignKey: "product_id"
// 	})
// }
// Cart.hasMany(Catalog, {
// 	foreignKey: "product_id" 
// })

module.exports = Cart;