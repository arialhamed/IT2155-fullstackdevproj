const express = require('express');
const router = express.Router();

const alertMessage = require('../helpers/messenger');

router.get('/', (req, res) => {
	const title = 'Abc Supermarket';
	res.render('index', {			// renders views/index.handlebars
		title
	})
});


router.get('/about', (req, res) => {
	const author = 'Group 4';
	
	res.render('about', {	// renders views/about.handlebars, passing author as variable
		author
	})
});

// User Login Route
router.get('/showLogin', (req, res) => {
	res.render('user/login');
});

// shows the register page
router.get('/showRegister', (req, res) => {
	res.render('user/register');		// Activates views/user/register.handlebar
});

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	alertMessage(res, 'info', 'Bye-bye!', 'fas fa-power-off', true);
	res.redirect('/');
});

module.exports = router;
