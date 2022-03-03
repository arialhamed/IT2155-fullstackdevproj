"use strict";

const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
// const Cart = require('./Cart');

const Catalog = db.define('catalog', {
	// defined by random integer in 6 digits
	product_id: {
		type: Sequelize.INTEGER
	},
	product_name: {
		type: Sequelize.STRING(1000)
	},
	product_desc: {
		type: Sequelize.STRING
	},
	product_price: {
		type: Sequelize.STRING
	},	
	product_stock: {
		type: Sequelize.INTEGER
	},
	// defined as 0 initially
	product_stocksold: {
		type: Sequelize.INTEGER
	},

	product_rate: {
		type: Sequelize.FLOAT
	},
	product_supplier: {
		type: Sequelize.STRING
	},

	product_URL: {
		type: Sequelize.STRING(512),
	},
	product_imageURL: {
		type: Sequelize.STRING(512),
	},


	
});

// Catalog.associate = (models) => {
// 	Catalog.belongsToMany(models.Cart, {
// 		as: "cart",
// 		foreignKey: "product_id"
// 	})
// }

// Catalog.belongsToMany(Cart)

module.exports = Catalog;
