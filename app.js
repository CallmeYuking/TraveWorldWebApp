var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Salmon Greek", image: "https://pixabay.com/get/57e6d7454e53ae14f6da8c7dda793f7f1636dfe2564c704c7d2d79d29644cc58_340.jpg"},
		{name: "Granite Hill", image: "https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg"},
		{name: "Montain Goat's Rest", image: "https://pixabay.com/get/52e5d7414355ac14f6da8c7dda793f7f1636dfe2564c704c7d2d7add904cc45d_340.jpg"}
	]

app.get("/", function(req, res){
	res.render("landing")
})

app.get("/campgrounds", function(req, res){
	
	res.render("campgrounds", {campgrounds: campgrounds})
})

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {
		name: name,
		image: image
	}
	campgrounds.push(newCampground);
	res.redirect("/campgrounds")
})

app.get("/campgrounds/new", function(req, res){
	
	res.render("new.ejs")
})

app.listen(3000, function(){
	console.log("The TravelTheWorld has started!!!")
});