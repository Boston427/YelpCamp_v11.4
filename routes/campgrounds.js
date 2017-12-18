var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require("geocoder");



// INDEX Route - show all campgrounds
router.get("/campgrounds", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
		}
	});
});

// CREATE Route - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var cost = req.body.cost;
	geocoder.geocode(req.body.location, function(err, data){
		var lat = data.results[0].geometry.location.lat;
	    var lng = data.results[0].geometry.location.lng;
	    var location = data.results[0].formatted_address;
		var newCampground = {name: name, image: image, cost: cost, description: desc, author:author, location: location, lat: lat, lng: lng};
		// Create a new campground and save to DB
		Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			}else{
				// redirect back to campgrounds page
				console.log(newlyCreated);
				res.redirect("/campgrounds");
			}
		});
	});
});

// NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new.ejs");
});
// This route has to come after /campgrounds/new
// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	});
	req.params.id
});

// Edit campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});
});

// Update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	geocoder.geocode(req.body.campground.location, function(err, data){
		var lat = data.results[0].geometry.location.lat;
	    var lng = data.results[0].geometry.location.lng;
	    var location = data.results[0].formatted_address;
		var newData = {name: req.body.campground.name, image: req.body.campground.image, cost: req.body.campground.cost, description: req.body.campground.description, location: location, lat: lat, lng: lng};
		Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success", "Successfully Updated")
				res.redirect("/campgrounds/" + campground._id);
			}
		});
	});
});

// Destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;