// Import Useful Node Libraries
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// Require Modules
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const usersRouterTest = require('./routes/test');

// Create the App
const app = express();

/* Net New */

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://garrettaudet:<13JhYrA51jla5mWd>@cluster0.bvmeolw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Add the Middleware Libraries
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Route-Handling Code for the Request Handling Chain
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/test', usersRouterTest);

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