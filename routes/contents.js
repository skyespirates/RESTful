const express = require("express");
const router  = express.Router();
var Content = require("../models/content");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/blogs/new", middleware.isLogin, (req, res) => {
    res.render("contents/new");
});
//  CREATE NEW POST/LOGIC
router.post("/blogs", middleware.isLogin, (req, res) => {
   //create blogs
   req.body.content.description = req.sanitize(req.body.content.description);
   Content.create(req.body.content, (err, content) => {
       if(err){
            res.render("contents/new");
        } else {
            content.author.id = req.user._id;
            content.author.username = req.user.username;
            content.save();
            res.redirect("/blogs");
       }
   })
});
//  SHOW/DISPLAY A CONTENT
router.get("/blogs/:id", (req, res) => {
    Content.findById(req.params.id).populate("comments").exec((err, post) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/show", {found: post});
        };
    });
});
//  EDIT/UPDATE A CONTENT/FORM
router.get("/blogs/:id/edit", middleware.checkContentOwnership, (req, res) => {
    Content.findById(req.params.id, (err, find) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/edit", {found: find});
        };
    });
});
//  EDIT/UPDATE A CONTENT/LOGIC
router.put("/blogs/:id", middleware.checkContentOwnership, (req, res) => {
    req.body.edit.description = req.sanitize(req.body.edit.description);
    Content.findByIdAndUpdate(req.params.id, req.body.edit, function(err, updated){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});
//  DELETE/DESTROY A CONTENT
router.delete("/blogs/:id", middleware.checkContentOwnership, (req, res) => {
    Content.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

module.exports = router;