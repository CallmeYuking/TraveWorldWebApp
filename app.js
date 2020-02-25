var express 	= require("express"),
	app 		= express(),
	request 	= require("request"),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose")

mongoose.connect("mongodb://localhost/trave_world", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


// SCHEMA SETUP
var  campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Montain Goat's Rest", image: "https://images.unsplash.com/photo-1581888517319-570283943d82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
// 	}, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("NEWLY CREATED CAMPGROUND");
// 			console.log(campground);
// 		}
// });


app.get("/", function(req, res){
	res.render("landing")
})

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds:allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {
		name: name,
		image: image
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

app.get("/campgrounds/new", function(req, res){
	
	res.render("new.ejs")
})

app.listen(3000, function(){
	console.log("The TravelTheWorld has started!!!")
});