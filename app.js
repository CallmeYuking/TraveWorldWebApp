var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");



app.listen(3000, function(){
	console.log("Now serving your app!!!")
});