const express = require("express");
const router  = express.Router();
const passport = require("passport");
var User = require("../models/user");
var Content = require("../models/content");

//  LANDING PAGE
router.get("/", (req, res) => {
    res.render("home");
});

//  CONTENTS PAGE
router.get("/blogs", (req, res) => {
    Content.find({}, (err, test) => {
        if(err){
            console.log(err);
        } else {
            // currentUser
            res.render("contents/index", {content: test});
        }
    })
});
//  ABOUT PAGE
router.get("/about", (req, res) => {
    res.render("about");
});
//  CREATE NEW POST/FORM
//  REGISTER
router.get("/register", (req, res) => {
    res.render("register");
})
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () =>{
            res.redirect("/blogs");
        })
    })
})
//  LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){}
    );

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
})

module.exports = router;