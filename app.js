var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    MovieList       = require("./models/userlist"),
    User            = require("./models/user");

// Database setup
var url = "mongodb://localhost/upnext";
mongoose.connect(url, {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is secret text or what?!",
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
});


app.get("/", function(req, res){
    res.redirect("/index");
});

app.get("/index", function(req, res){
    res.render("index");
});


// ********************
//      API ROUTES
// ********************

app.get("/api/list", function(req, res){
    MovieList.find()
        .then(function(user){
            res.json(user);
        })
        .catch(function(err){
            console.log(err);
        })
});

app.post("/api/userlist", function(req, res){
    var currentUser_id = req.user.id
    var name = req.body.name
    MovieList.create({name: name, author_id: currentUser_id})
        .then(function(newList){
            res.status(201).json(newList)
        })
        .catch(function(err){
                res.send(err);
        })
});
            


// ********************
//      AUTH ROUTES
// ********************

// handle sign up logic
app.post("/index/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.redirect("/index");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/index");
        });
    });
});

// Login route
app.post("/index/login", function(req, res, next){
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/index"
    })(req, res, next);
});

// Log out
app.get("/index/logout", function(req, res){
    req.logout();
    res.redirect("/index");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER STARTED ON PORT " + process.env.PORT);
});