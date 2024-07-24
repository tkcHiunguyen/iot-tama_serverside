const Express = require('express')
const controller = require('../controllers/authController')
const bcrypt = require('bcryptjs')
const authenticateToken = require("../middleware/jwt")


let router = Express.Router()

const initAuthRoute = (app) => {
    router.post("/login", controller.post_login);
    router.post('/register', controller.post_register)
    router.post('/refresh-token', controller.post_refresh_token)
    router.delete('/delete-token', controller.delete_token)
    return app.use('/auth', router)
}
module.exports = initAuthRoute