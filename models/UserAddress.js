const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/* 	Creates a user(s) table in MySQL Database. 
	Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const UserAddress = db.define('userAddress', { 	
	email: {
		type: Sequelize.STRING
	},
	address: {
		type: Sequelize.STRING
	},
	nick: {
		type: Sequelize.STRING
	},
	primary: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
});

module.exports = UserAddress;