// Import Useful Node Libraries
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression"); 
const helmet = require("helmet"); // Require helmet module
const RateLimit = require("express-rate-limit");

// Require Modules
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

// Create the App
const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url = "mongodb+srv://garrettaudet:13JhYrA51jla5mWd@cluster0.bvmeolw.mongodb.net/library_server?retryWrites=true&w=majority&appName=Cluster0"
const mongoDB = process.env.MONGODB_URI || dev_db_url;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000  // Increase the timeout to 60 seconds
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add the Middleware Libraries
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(compression()); // Compress all routes

// Set Content Security Policy with Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// Apply rate limiter to all requests
app.use(limiter);

// Route-Handling Code for the Request Handling Chain
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler methods
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Add the Module Exports to be Used in /bin/www
module.exports = app;
