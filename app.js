/** Express app for message.ly. */
const express = require("express");
const app = express();
const ExpressError = require("./expressError")
const cors = require("cors");
const { authenticateJWT } = require("./middleware/auth");


// allow both form-encoded and json body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// allow connections to all routes from any browser
app.use(cors());

// get auth token for all routes
app.use(authenticateJWT);

/** routes */

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);







app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

// generic error handler
app.use((err, req, res, next)=> {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;
  // set the status and alert the user
  return res.status(status).json({
      error: {message, status}
  });
});


module.exports = app;

