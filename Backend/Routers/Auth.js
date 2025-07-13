const express = require('express');
const { getLogin, postLogin, getSignUp, postSignUp, userLogout } = require('../Controllers/AuthHandler');
const AuthRouter = express.Router();



AuthRouter.get('/login', getLogin).post('/login', postLogin)

AuthRouter.get('/signup', getSignUp).post('/signup', postSignUp)
AuthRouter.post("/logout", userLogout);

module.exports = { AuthRouter }

