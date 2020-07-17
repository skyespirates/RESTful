const express            = require("express"),
      app                = express(),
      mongoose           = require("mongoose"),
      bodyParser         = require("body-parser"),
      methodOverride     = require("method-override"),
      expressSanitizer   = require("express-sanitizer");
      
var   Content            = require("./models/content"),
      seedDB             = require("./seeds"),    
      Comment              = require("./models/comment");      
    //   User               = require("./models/user");      

mongoose.connect("mongodb://localhost:27017/restful", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(console.log("connected to mongoDB"));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// seedDB();


// Content.create({
//     title: "second",
//     image: "https://images.unsplash.com/photo-1594012487062-cfdf01df1d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//     description: "second upload content"
// });


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/blogs", (req, res) => {
    Content.find({}, (err, test) => {
        if(err){
            console.log(err);
        } else {
            res.render("contents/index", {content: test});
        }
    })
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/blogs/new", (req, res) => {
    res.render("contents/new");
});

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

app.get("/blogs/:id", (req, res) => {
    Content.findById(req.params.id).populate("comments").exec((err, post) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/show", {found: post});
        };
    });
});

app.get("/blogs/:id/edit", (req, res) => {
    Content.findById(req.params.id, (err, find) => {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("contents/edit", {found: find});
        };
    });
});
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

app.delete("/blogs/:id", (req, res) => {
    Content.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id/comments/new", (req, res) => {
    Content.findById(req.params.id, (err, cont) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {content: cont});
        }
    })
});
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

app.listen(3000, (req, res) => {
    console.log("connected...");
})