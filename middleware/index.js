var Content = require("../models/content");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkContentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Content.findById(req.params.id, (err, found) => {
                if(err){
                    res.redirect("back");
                } else {
                    if(found.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            })
        } else {
            res.redirect("/login");
        }
};
middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.cid, (err, found) => {
                if(err){
                    res.redirect("back");
                } else {
                    if(found.author.id.equals(req.user._id)){
                        next();
                    } else {
                        res.send("Ini bukan komentar anda :) maap");
                        // res.redirect("back");
                    }
                }
            })
        } else {
            res.send("Login dulu gih");
            // res.redirect("/login");
        }
};
middlewareObj.isLogin = function(req, res, next){
        if(req.isAuthenticated()){
            next();
        } else {
            res.redirect("/login");
        }
};

module.exports = middlewareObj;