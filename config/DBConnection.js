const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const cart = require('../models/Cart');
const catalog = require('../models/Catalog');

// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
	mySQLDB.authenticate()
		.then(() => {
			console.log('Abc Supermarket database connected');
		})
		.then(() => {
			/*
				Defines the relationship where a user has many items in cart.
				In this case the primary key from user will be a foreign key
				in the cart
				*/
			user.hasMany(cart);
			mySQLDB.sync({ // Creates table if none exists
				force: drop
			}).then(() => {
				console.log('Create tables if none exists')
			}).catch(err => console.log(err))
		})
		.catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };
