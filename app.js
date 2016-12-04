'use strict'

var mongoose = require("mongoose")
var express = require("express")
var bodyParser = require("body-parser")
var http = require("http")

var app = express()
var server = http.Server(app)
var io = require("socket.io")(server)
var controller = require("./controller")


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.Promise = global.Promise

// mongoose.connect("mongodb://localhost/snsDB")
mongoose.connect("mongodb://heroku_6rvc525t:pcbc0h1bp3c73adlc4pe6ru8cc@ds149207.mlab.com:49207/heroku_6rvc525t")

//******* Socket.io ***************//

require("./socket/socket.js")(io)


//***********************
app.get("/", function(req, res){
	res.sendFile(__dirname + "/socket/socket_test.html")
})

// ホーム GET
app.get("/community/list/:sort_by/:limit", controller.getCommunities)

// コミュニティ作成 POST
app.post("/community/create", controller.createCommunity)

// コミュニティ参加
app.post("/community/join", controller.joinCommunity)

// コミュニティ削除
app.post("/community/delete/:community_id", controller.deleteCommunity)

//
//app.get("/chat/information/:community_id", controller.chatInformation)

module.exports = server
