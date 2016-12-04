'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema
var bcrypt = require("bcrypt")

// Define community schema
var communitySchema = Schema({
	_id: Number,
	name: {type: String, select: true},
	host_name: {type: String, required: true, trim: true, select: true},
	host_id: {type: Number, select: true},
	// set password to not queryable (without select)
	password: {type: String, required: true, trim: true, select: false},
	created_at: {type: Date, default: Date.now},
	messages: [{type: Schema.Types.ObjectId, ref:"Message"}]
})

// Define message schema
var messageSchema = Schema({
	message: String,
	user_id: Number,
	user_name: {type: String, trim: true},
	//community: {type: Number, ref: "Community"},
	created_at: {type: Date, default: Date.now}
})

// Create a virtual response
communitySchema.virtual("response").get(function(){
	return {
		_id: this._id,
		name: this.name,
		host_name: this.host_name,
		host_id: this.host_id
	}
})

var Community = mongoose.model("Community", communitySchema)
var Message = mongoose.model("Message", messageSchema)

exports.Community = Community
exports.Message = Message

/****************************
Function()

*******************************/

// Hash password function
exports.hashedPassword = function(password, callback){
	bcrypt.hash(password, 10, function(err, hash){
			if (err) {return callback(err)}
			callback(null, hash)
		})
}

// Compare password
exports.comparePassword = function(password, hashedPassword, callback){
	bcrypt.compare(password, hashedPassword, function(err, isMatch){
		if (err) {return callback(err, null)}
		callback(null, isMatch)
	})
}






