const express = require("express");
const router  = express.Router();
var Content = require("../models/content");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//  CREATE A NEW COMMENT/FORM
router.get("/blogs/:id/comments/new", middleware.isLogin, (req, res) => {
    Content.findById(req.params.id, (err, cont) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {content: cont});
        }
    })
});
//  CREATE A NEW COMMENT/LOGIC
router.post("/blogs/:id/comments", middleware.isLogin, (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(err){
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    content.comments.push(comment);
                    content.save();
                    res.redirect("/blogs/" + content._id);
                }
            })
        }
    })
});
//  UPDATE/EDIT A COMMENT/FORM
router.get("/blogs/:id/comments/:cid/edit", middleware.checkCommentOwnership, (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(err){
            console.log(err)
        } else {
            Comment.findById(req.params.cid, (err, comment) => {
                if(err){
                    res.redirect("/blogs");
                } else {
                    res.render("comments/edit", {content: content, comment: comment});          
                }
            })
        }
    })
});
//  UPDATE/EDIT A COMMENT/LOGIC
router.put("/blogs/:id/comments/:cid", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, success) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})
//  DESTROY/DELETE A COMMENT
router.delete("/blogs/:id/comments/:cid", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err, deleted) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

module.exports = router;