var express 	= require("express"),
	app 		= express(),
	request 	= require("request"),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Campground  = require("./models/campground"),
	seedDB		= require("./seeds")

seedDB();
mongoose.connect("mongodb://localhost/trave_world", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.render("landing")
})

// INDEX - show all campgrounds.
app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds:allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB.
app.post("/campgrounds", function(req, res){
	var name = req.body.name,
		image = req.body.image,
		desc = req.body.description,
		newCampground = {
		name: name,
		image: image,
		description: desc
	}
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect('/campgrounds')
		}
	})
})

// NEW - show form to create new campground.
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs")
})

//SHOW - shows more info about one campground.
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground)
			//render show template with that campground
			res.render("show", {campground: foundCampground})
		}
	})
})

app.listen(3000, function(){
	console.log("The TravelTheWorld has started!!!")
});