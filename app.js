const express            = require("express"),
      app                = express(),
      mongoose           = require("mongoose"),
      bodyParser         = require("body-parser"),
      methodOverride     = require("method-override"),
      expressSanitizer   = require("express-sanitizer"),
      passport           = require("passport"),
      LocalStrategy      = require("passport-local");
      
var   Content            = require("./models/content"),
      seedDB             = require("./seeds"),    
      Comment              = require("./models/comment");      
      User               = require("./models/user");      

mongoose.connect("mongodb://localhost:27017/restful", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
                ).then(() =>{
                    console.log("connected to mongoDB")})
                .catch((err) =>{
                    console.log("connection error " + err)
                })


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//  PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Skyes Crawford",
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
// seedDB();

//  LANDING PAGE
app.get("/", (req, res) => {
    res.render("home");
});

//  CONTENTS PAGE
app.get("/blogs", (req, res) => {
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
app.get("/about", (req, res) => {
    res.render("about");
});
//  CREATE NEW POST/FORM
app.get("/blogs/new", (req, res) => {
    res.render("contents/new");
});
//  CREATE NEW POST/LOGIC
app.post("/blogs", (req, res) => {
   //create blogs
   req.body.content.description = req.sanitize(req.body.content.description);
   Content.create(req.body.content, (err, content) => {
       if(err){
            res.render("contents/new");
        } else {
           //redirect
           res.redirect("/blogs");
       }
   })
});
//  SHOW/DISPLAY A CONTENT
app.get("/blogs/:id", (req, res) => {
    Content.findById(req.params.id).populate("comments").exec((err, post) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/show", {found: post});
        };
    });
});
//  EDIT/UPDATE A CONTENT/FORM
app.get("/blogs/:id/edit", (req, res) => {
    Content.findById(req.params.id, (err, find) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/edit", {found: find});
        };
    });
});
//  EDIT/UPDATE A CONTENT/LOGIC
app.put("/blogs/:id", (req, res) => {
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
app.delete("/blogs/:id", (req, res) => {
    Content.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
//  CREATE A NEW COMMENT/FORM
app.get("/blogs/:id/comments/new", (req, res) => {
    Content.findById(req.params.id, (err, cont) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {content: cont});
        }
    })
});
//  CREATE A NEW COMMENT/LOGIC
app.post("/blogs/:id/comments", (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(err){
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    content.comments.push(comment);
                    content.save();
                    res.redirect("/blogs/" + content._id);
                }
            })
        }
    })
});
//  UPDATE/EDIT A COMMENT/FORM
app.get("/blogs/:id/comments/:cid/edit", (req, res) => {
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
app.put("/blogs/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, (err, success) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})
//  DESTROY/DELETE A COMMENT
app.delete("/blogs/:id/comments/:cid", (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err, deleted) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});
//  REGISTER
app.get("/register", (req, res) => {
    res.render("register");
})
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
})

app.listen(3000, (req, res) => {
    console.log("connected...");
})