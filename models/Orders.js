const Sequelize = require('sequelize');
const { models } = require('../config/DBConfig');
const db = require('../config/DBConfig');

/* 	Creates a user(s) table in MySQL Database. 
	Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Orders = db.define('orders', { 	
    // ten digit id
	order_id: {
		type: Sequelize.INTEGER
	},
    // basically, which cart is it? which is basically which user
    cart_id: {
        type: Sequelize.INTEGER
    },
    total_price: {
        type: Sequelize.DECIMAL(9,2)
    },
    delivery_status: {
        type: Sequelize.STRING
    },
    delivery_date_est: {
        type: Sequelize.DATE
    },
    shipping: {
        type: Sequelize.STRING
    },
    cart_details: {
        type: Sequelize.JSON
    }
});

// Orders.associate = (models) => {
//     Orders.hasMany(models.Cart, {
//         foreignKey: 'cart_id'
//     })
// }
module.exports = Orders;