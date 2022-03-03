const express = require('express');
const router = express.Router();
const moment = require('moment');
const Catalog = require('../models/Catalog');
const session = require('express-session');

// For sequelize querying
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Flash Messenger
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require("../helpers/auth");

// Required for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const { Console } = require('console');
const bodyParser = require('body-parser');

// Upload new catalog image
router.post('/upload', ensureAuthenticated, (req, res) => {
	if (!fs.existsSync('./public/uploads/catalog')){
		fs.mkdirSync('./public/uploads/catalog');
	}
	
	upload(req, res, (err) => {
		if (err) {
			res.json({file: '/img/no-image.jpg', err: err});
		} else {
			if (req.file === undefined) {
				res.json({file: '/img/no-image.jpg', err: err});
			} else {
				res.json({file: `/uploads/catalog/${req.file.filename}`});
			}
		}
	});
})


router.get('/upload', ensureAuthenticated, (req, res) => {
    res.render('catalog/uploadItem');
})


// Adds new catalog item
router.post('/addItem', ensureAuthenticated, (req, res) => {
	// creates 6 digit unique product_id
	let product_id = Math.floor(Math.random() * (Math.floor(999999) - Math.ceil(100000)) + Math.ceil(100000));
	let product_name = req.body.product_name;
    let product_desc = req.body.product_desc;
    let product_price = req.body.product_price;
	let product_stock = req.body.product_stock;
	let product_stocksold = 0;
	let product_rate = 0.0;
	let product_supplier = req.body.product_supplier;
	let product_URL = "/catalog/" + product_id.toString() + "_"+ (req.body.product_name).replace(/ /g, '_');
    let product_imageURL = req.body.product_imageURL;
	Catalog.create({
		product_id,
        product_name,
		product_desc,
		product_price,
		product_stock,
		product_stocksold,
		product_rate,
		product_supplier,
		product_URL,
		product_imageURL
	}).then((catalog) => {
		res.redirect('/catalog'); // redirect to call router.get(/listVideos...) to retrieve all updated
		// videos
	}).catch(err => console.log(err))
});

//List items in catalog
router.get('/', (req, res) => {
	// default sort variables
	let sort = ['product_name', 'ASC'];
	// Admin's userid = 1, manually add more here
	let admin_nos = [1];
	let is_admin = () => {
		try{
			if (admin_nos.includes(req.user.id)){
				return true
			} else {
				return false
			}
		} catch {
			return false
		}
	}

	// gets sortType if exists, else, creates into session
	if (req.session.sortType){
		sort = req.session.sortType;
	} else {
		req.session.sortType = sort;
	}

	// just to make things look nice in the HTML
	let sort_name = () => {
		let sort_name_temporary = "Sorted by ";
		if (sort[0] === 'product_name'){
			sort_name_temporary = sort_name_temporary + "Name ("
		} else if (sort[0] === "product_price"){
			sort_name_temporary = sort_name_temporary + "Price ("
		} else if (sort[0] === "product_supplier"){
			sort_name_temporary = sort_name_temporary + "Supplier Name ("
		}

		if (sort[1] === "ASC"){
			sort_name_temporary = sort_name_temporary + "Ascending)"
		} else {
			sort_name_temporary = sort_name_temporary + "Descending)"
		}
		return sort_name_temporary;
	}
	// Finds alllll catalog items, with product_stock 0, and by order
	Catalog.findAll({
		order: [
			sort
		],
		where: {
			product_stock: {
				[Op.not]: 0,
			},
		},
		raw: true
	})
	.then((catalog) => {
		// pass object to catalog.handlebar
		res.render('catalog/catalog', {
			catalog: catalog,
			sort_name: sort_name,
			is_admin: is_admin(),
		});
	})
	.catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
	Catalog.findOne({
		where: {
			product_URL: "/catalog/" + req.params.id,
		},
		raw: true		
	})
	.then((catalog) => {
		res.render('catalog/catalogitem', {
			catalog: catalog,
			rate: (catalog.product_rate == 0.0) 
		});	
	})
	.catch(err => console.log(err));
});

// changes sort values from the dropdown
router.get('/sort/:id', (req, res) => {
	let checker = (req.params.id).substr(0, (req.params.id).indexOf("_"));
	if (checker === "az"){
		req.session.sortType = ['product_name', (req.params.id).split("_").pop()]
	} else if (checker === "price"){
		req.session.sortType = ['product_price', (req.params.id).split("_").pop()]
	} else if (checker === "supplier"){
		req.session.sortType = ['product_supplier', (req.params.id).split("_").pop()]
	}
	res.redirect('/catalog');
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Catalog.findOne({
		where: {
			product_id: parseInt(req.params.id)
		}
	}).then((catalog) => {
		res.render('catalog/edititem', {
			catalog
		})
	})
})

router.put('/saveEdit/_:id', ensureAuthenticated, (req, res) => {
	Catalog.update({
		product_name: req.body.product_name,
		product_desc: req.body.product_desc,
		product_price: req.body.product_price,
		product_stock: req.body.product_stock,
		product_supplier: req.body.product_supplier,
		product_url: "/catalog/" + req.params.id + "_"+ (req.body.product_name).replace(/ /g, '_'),
		product_imageURL: req.body.product_imageURL,
	}, {
		where: {product_id: parseInt(req.params.id)}
	}).then(() => {
		res.redirect('/catalog')
	})
})

module.exports = router;