var express = require("express"),
	router = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment = require("../models/comment")

// ====================================
//COMMENTS ROUTE
// ====================================

//comment new
router.get("/new", isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

//comment create
router.post("/", isLoggedIn, function(req, res){
	//lookuo campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					console.log("New comment's username will be: " + req.user.username);
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					//redirect campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}


module.exports = router
