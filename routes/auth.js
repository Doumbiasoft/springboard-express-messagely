const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY } = require("../config");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError("username and password are required!", 400);
        }
        let current_user = await User.get(username);
        if (!current_user){
          throw new ExpressError("Invalid user/password", 400);
        }

        if(await User.authenticate(username, password) === true){
                let token = jwt.sign({username: username}, SECRET_KEY);
                await User.updateLoginTimestamp(username);
                return res.json({ token: token });
        }
        throw new ExpressError("Invalid user/password", 400);
    } catch (err) {
       return next(err);
    }
  });


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
    try {
      const { username, password, first_name, last_name, phone } = req.body;
      if (!username || !password || !first_name || !last_name || !phone) {
        throw new ExpressError("username, password, first_name, last_name and phone are required!", 400);
    }
   const u = {
      username: username,
      password: password,
      first_name:first_name,
      last_name: last_name,
      phone:phone,
    }
      let user = await User.register(u);
      if (user) {
        let token = jwt.sign({username: user.username}, SECRET_KEY);
        await User.updateLoginTimestamp(username);
        return res.json({ token: token });
      }
      throw new ExpressError("Registration failed!", 400);
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;