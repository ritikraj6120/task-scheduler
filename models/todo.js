const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
	todo: {
		type: String
	}
});

const item = mongoose.model("Item", todoSchema);
module.exports = { todoSchema, item };