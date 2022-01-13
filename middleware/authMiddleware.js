const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const {secretkey} = require("../config/config.js");
const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	// check json web token exists & is verified
	if (token) {
		jwt.verify(token, secretkey, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/login');
			} 
			else {
				// console.log("hi");
				// console.log(decodedToken);
				req.body.email = decodedToken.email;
				// console.log(typeof req.body.email);
				next();
			}
		});
	} 
	
	else {
		res.redirect('/login');
	}
};

// check current user
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, secretkey, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				next();
			} else {
				let user = await User.findOne({email:decodedToken.email});
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};


module.exports = { requireAuth, checkUser };