var express    = require('express'),
	app		   = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User 	   = require("./models/user"),
	seedDB 	   = require("./seeds"), 
	LocalStrategy = require("passport-local"),
	flash = require("connect-flash"),
	passport   = require("passport"),
	methodOverride = require("method-override")
	

// requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index")


mongoose.connect("mongodb://localhost/yelp_camp_v11", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

app.locals.moment = require('moment');

// passport config
app.use(require("express-session")({
	secret: "Once again",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, function(){
	console.log("The YelpCamp server has started");
})