"use strict"

var app = require("./app.js")
var port = Number(process.env.PORT || 1024)

app.listen(port, function(){
	console.log("Server is running..")
})
