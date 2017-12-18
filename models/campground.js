var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
// mongoose.Promise = global.Promise;

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	cost: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);