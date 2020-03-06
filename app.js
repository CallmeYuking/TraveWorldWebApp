var express 		= require("express"),
	app 			= express(),
	request 		= require("request"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy 	= require("passport-local"),
	Campground  	= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	seedDB			= require("./seeds")

// seedDB();
mongoose.connect("mongodb://localhost/trave_world", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "this is really secret!",
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
	next();
})

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
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
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
	res.render("campgrounds/new")
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
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
})

// ====================================
//COMMENTS ROUTE
// ====================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
					//connect new comment to campground
					campground.comments.push(comment)
					campground.save()
					//redirect campground show page
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
})

//==============================================
// AUTH ROUTES
//==============================================

//show register form
app.get("/register", function(req, res){
	res.render("register")
})
//handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds")
		});
	});
});

//show login form
app.get("/login", function(req, res){
	res.render("login")
})
//handle login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
})

//logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}





app.listen(3000, function(){
	console.log("The TravelTheWorld has started!!!")
});