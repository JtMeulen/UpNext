var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    MovieList       = require("./models/userlist"),
    User            = require("./models/user");

// Database setup
var url = process.env.DATABASEURL || "mongodb://localhost/upnext";
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
// Get collection of all the lists api
app.get("/api/alllists", function(req, res){
    MovieList.find()
        .then(function(user){
            res.json(user);
        })
        .catch(function(err){
            console.log(err);
        })
});

// Create a new list
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

// Get the List api
app.get("/api/list/:id", function(req, res){
    var id = req.params.id
    MovieList.findById(id)
        .then(function(list){
            res.json(list)
        })
        .catch(function(err){
            console.log(err);
        })
});

// delete List from DB
app.delete("/api/list/:id", function(req, res){
    var id = req.params.id;
    MovieList.findByIdAndRemove(id)
        .then(function(list){
            res.json(list)
        })
        .catch(function(err){
            console.log(err);
        })
})

// Put the movie in a List
app.put("/api/list/:id", function(req, res){
    var movie = req.body;
    MovieList.findByIdAndUpdate(req.params.id, {$push: {movies: movie}}, {new:true})
    .then(function(list){
        res.status(201).json(list)
    });
});

// delete a movie from the list
app.put("/api/list/:id/delete", function(req, res){
    var movie_id = req.body.movie_id;
    MovieList.findByIdAndUpdate(req.params.id, {$pull: {"movies": {"movie_id": movie_id}}}, {new:true})
    .then(function(list){
        res.status(201).json(list)
    });
});

// update a movie to seen status
app.put("/api/list/:id/update/seen", function(req, res){
    var movie_id = req.body.movie_Id;
    MovieList.update({'movies.movie_id': movie_id}, {$set: {"movies.$.seen": "seen"}})
    .then(function(list){
        res.status(201).json(list)
    });
});

// update a movie to not-seen status
app.put("/api/list/:id/update/notseen", function(req, res){
    var movie_id = req.body.movie_Id;
    MovieList.update({'movies.movie_id': movie_id}, {$set: {"movies.$.seen": "not-seen"}})
    .then(function(list){
        res.status(201).json(list)
    });
});

// Add user a user to a list
app.put("/api/list/:id/adduser", function(req, res){
    var username = req.body.username;
    MovieList.update({_id: req.params.id}, {$push: {"users": username}}, {new:true})
    .then(function(list){
        res.status(201).json(list)
    });
})

// delete a shared list from your view
app.put("/api/shared/:id", function(req, res){
    var username = req.body.username;
    MovieList.update({_id: req.params.id}, {$pull: {"users": username}}, {new:true})
    .then(function(list){
        res.status(201).json(list)
    });
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