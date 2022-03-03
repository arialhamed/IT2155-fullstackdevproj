const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const UserCard = db.define('userCard', { 	
	email: {
		type: Sequelize.STRING
	},
	primary: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	card_num: {
		type: Sequelize.STRING
	},
	exp_date: {
		type: Sequelize.STRING
	},
	cvv: {
		type: Sequelize.STRING
	},
	nick: {
		type: Sequelize.STRING
	}
});

module.exports = UserCard;