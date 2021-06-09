if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");


//User Authentication Passport
const passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");


const app = express();
const MongoDBStore = require("connect-mongo");


const photosRoutes = require("./routes/photos");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

// const dbURL = process.env.DB_URL;
const db_URL = process.env.DB_URL || "mongodb://localhost:27017/PhotoPortfolio";

mongoose.connect(db_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//setting view engine, ejs and paths
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

//getting info from forms 
app.use(express.urlencoded({ extended: true }));

//using _method string to use delete/patch 
app.use(methodOverride("_method"));

//serve static files via public folder
app.use(express.static(path.join(__dirname, "public")))
app.use(mongoSanitize());

// Advanced usage
const store = MongoDBStore.create({
    mongoUrl: db_URL,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (err) {
    console.log("Session store error", e);
});


const secret = process.env.SECRET || "secretpassword";

//Session configuration
const sessionConfig = {
    store,
    name: 'fafweagzczvcvs',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzerhy9du/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.path = req.path || "/";
    res.locals.user = req.user || "";
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


//using external route files
app.use("/photos", photosRoutes);
app.use("/photos/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);


app.get("/", (req, res) => {
    res.render("home");
});


//route for page not found
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

//Error handling
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error", { message, status, err });
});
const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    console.log("Listening on Port ", port);
});