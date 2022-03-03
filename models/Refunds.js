  
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Refunds = db.define('refunds', {
    refund_id: {
        type: Sequelize.INTEGER
    },
    order_id: {
        type: Sequelize.INTEGER
    },
    cart_id: {
        type: Sequelize.INTEGER
    },
    reason: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING(2000)
    },
});

module.exports = Refunds;