'use strict'

var Community = require("./model").Community
var Message = require("./model").Message
var mongoose = require("mongoose")
var comparePassword = require("./model").comparePassword
var hashedPassword = require("./model").hashedPassword


// コミュニティの作成
exports.createCommunity = function(req, res){
	var _id = req.body._id
	var name = req.body.name
	var host_name = req.body.host_name
	var host_id = req.body.host_id
	var password = req.body.password
	// Hash a password and save
	var hash= hashedPassword(password, function(err, hash){
		if (err) {return console.log(err)}

		var newCommunity = new Community({
			_id: _id,
			name: name,
			host_name: host_name,
			host_id: host_id,
			password: hash
		})

		newCommunity.save(function(err, community){
			if (err) { return res.status(500).send(err) }
			console.log("saved new comment!")
			// Response with virtual response to prevent sending password
			res.status(200).send(newCommunity.response)	
		})
	})	
}



// GET Communities (Changed from offset to sort_by)
exports.getCommunities = function(req, res){
	console.log(req.params)

	Community.find({}).limit(Number(req.params.limit))
					.select({messages: 0})	// Exclude messages(reducing large payload)
					.sort(req.params.sort_by)
					.exec(function(err, communities){
						if (err) {return res.status(422).send("Error at getCommunities")}
						//
						res.status(200).send(communities)
					})
}



// コミュニティ参加
exports.joinCommunity = function(req, res){
	var _id = req.body._id.trim()
	var password = req.body.password.trim()

	// Check, if _id or password is blank
	// if (password === "") {
	// 	return res.status(422).send("Require password")
	// }
	if (_id === "") {
		return res.status(422).send("Require _id")
	}

	// Check, if password match
	Community.findOne({"_id": _id})
			.select("password")		// query only password and _id
			.exec(function(err, community){
				console.log(community)
				if (err) {return res.status(500).send(err)}
				if (!community) {
					return res.status(422).send("Can not find community with id " + _id)
				}
				//
				comparePassword(password, community.password, function(err, isMatch){
					// if err
					if (err) {return res.status(422).send("Somthing wrong with comparePassword!")}
					// if does not match
					if (isMatch === false) {
						return res.status(422).send("Password is not match!")
					}else{
						// if password matched
						res.status(200).send(Community(community).response)
						//res.status(200).send("Success!")
					}
				})
			})
}




// コミュニティ削除
exports.deleteCommunity = function(req, res){
	var _id = req.params.community_id
	var user_id = Number(req.body.user_id)

	// user_idがhost_idと等しければ削除
	Community.findOne({_id: _id}).exec(function(err, community){
		if (err) {return res.status(500).send(err)}
		if (!community) {
			return res.status(422).send("Can not find community with id " + _id)
		}
	
		// if user_id !== host_id
		if (user_id !== community.host_id) {
			return res.status(422).send("Only Admin can delete this community")
		}
		// if everything ok
		Community.remove({_id: _id}, function(err){
			if (err) {return res.status(500).send("Can not remove!")}
			res.status(204).send("Successful removed!")
		})
	})
}



//
exports.chatInformation = function(req, res){
	var _id = req.params.community_id

	Community.findOne({_id: _id})
				.populate("messages")
				.exec(function(err, community){
					if (err) {return res.status(500).send(err)}
					if (!community) {
						return res.status(422).send("Can not find community with id " + _id)
					}
					//
					return res.status(200).json(community.messages)
				})
}







