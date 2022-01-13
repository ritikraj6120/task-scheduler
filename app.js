const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const { todoSchema, item } = require("./models/todo.js");
const User = require('./models/User');
const app = express();
const { mongoDB } = require('./config/keys.js');
// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// view engine
app.set("view engine", "ejs");


let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}

mongoose.connect(mongoDB)
	.then((result) => app.listen(port))
	.catch((err) => console.log(err));


app.get('*', checkUser);
app.get("/about", function (req, res) {
	res.render("about");
});

app.get("/", requireAuth, function (req, res) {
	// console.log(req.body.email);
	// console.log(typeof req.body.email);
	// console.log("hello again");
	User.find({ email: req.body.email }, function (err, foundItems) {
		// console.log(foundItems);
		const sum = foundItems[0];
		// console.log(sum);
		// console.log(typeof sum);
		// console.log(typeof foundItems.email);
		// console.log("bye");
		// console.log(typeof sum.items);
		res.render("list", { x: sum.items });
	});
});


app.post("/add", requireAuth, function (req, res) {
	// console.log(req.body);
	let email = req.body.email;
	const newtodo = req.body.newtodo;
	const newitem = new item({
		todo: newtodo
	});
	User.findOneAndUpdate({ email: email }, { $push: { items: newitem } },
		function (err, doc) {
			if (!err) {
				res.redirect('/');
			}
			else {
				console.log('Error during record insertion : ' + err);
			}
		});
	// User.findOne(filter, function (err, foundList) {
	// 	foundList.items.push(newitem);
	// 	foundList.save((err, doc) => {
	// 		if (!err) {
	// 			res.redirect('/');
	// 		}
	// 		else
	// 			console.log('Error during record insertion : ' + err);
	// 	});
	// });
});





app.post("/delete", requireAuth, function (req, res) {
	const todoid = req.body.todoid;
	let email = req.body.email;
	// console.log(todoid);
	// User.findByOne({email:email}, function (err,foundItems) {
	// 	const sum=foundItems[0].items;
	User.findOneAndUpdate({ email: email }, { $pull: { items: { _id: todoid } } },
		function (err, foundList) {
			if (err) {
				console.log(err);
			}
			else {
				res.redirect("/");
			}
		});
});

app.use(authRoutes);




