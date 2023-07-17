const express = require('express');
const router = new express.Router();
const Message = require('../models/message');
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const id = req.params.id;
        if (!id){
            throw new ExpressError('id is required!',400); 
        }
        let message = await Message.get(id);
        res.json(message);
    } catch (error) {
        return next(error);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async function (req, res, next) {
    try {
        const {to_username, body} = req.body;
        if (!to_username || !body) {
            throw new ExpressError('to_username and body are required!',400); 
        }
        let message = await Message.create(req.user.username, to_username, body);
        res.json(message);
    } catch (error) {
        return next(error);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.get('/:id/read', ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    try {
        const id = req.params.id;
        if (!id){
            throw new ExpressError('id is required!',400); 
        }
        let message = await Message.markRead(id);
        res.json(message);
    } catch (error) {
        return next(error);
    }
});


module.exports = router;

