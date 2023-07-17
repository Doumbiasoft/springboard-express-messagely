const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async function (req, res, next) {
    try {
        let users = await User.all();
        res.json(users);
    } catch (error) {
        return next(error);
    }
});


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    try {
        const username = req.params.username;
        if (!username){
            throw new ExpressError('username is required!',400); 
        }
        let user = await User.get(username);
        res.json(user);
    } catch (error) {
        return next(error);
    }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    try {
        const username = req.params.username;
        if (!username){
            throw new ExpressError('username is required!',400); 
        }
        let messages = await User.messagesFrom(username);
        res.json(messages);
    } catch (error) {
        return next(error);
    }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    try {
        const username = req.params.username;
        if (!username){
            throw new ExpressError('username is required!',400); 
        }
        let messages = await User.messagesTo(username);
        res.json(messages);
    } catch (error) {
       return next(error);
    }
});

module.exports = router;
