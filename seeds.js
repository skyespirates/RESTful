var mongoose = require("mongoose");
var Content = require("./models/content");
var Comment = require("./models/comment");

var data = [
    {title: "Skyes", image: "https://images.unsplash.com/photo-1594025598468-f2ac06104cb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Pellentesque rutrum sit amet enim id."},
    {title: "Crawford", image: "https://images.unsplash.com/photo-1594033849958-7302586341c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Pellentesque rutrum sit amet enim id."},
    {title: "Alexandria", image: "https://images.unsplash.com/photo-1594076119211-b1ab76a922b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", description: "Pellentesque rutrum sit amet enim id."}
];

    //  delete all contents
function seedDB(){
    Content.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("Contents removed...");
        //  add some contents
        data.forEach(function(seed){
            Content.create(seed, function(err, cont){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added new content");
                    Comment.create({author: "Crwford", text: "In hac habitasse platea dictumst. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus molestie condimentum dui eu maximus."}, function(err, cmt){
                        if(err){
                            console.log(err);
                        } else {
                            cont.comments.push(cmt);
                            cont.save();
                            console.log("Successfully added comments");
                        }
                    });
                }
            });
            
        });
    });
};
module.exports = seedDB;