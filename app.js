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
      Comment            = require("./models/comment");      
      User               = require("./models/user");  
      
const contentRoutes = require("./routes/contents"),
      commentRoutes = require("./routes/comments"),
      indexRoutes   = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/restful";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
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

app.use(indexRoutes);
app.use(contentRoutes);
app.use(commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});