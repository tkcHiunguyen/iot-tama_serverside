const Express = require('express')
const controller = require('../controllers/apiController')
const bcrypt = require('bcryptjs')

let router = Express.Router()

const initApiRoute = (app) => {
    router.get('/get_all_user', controller.get_all_user)
    return app.use('/api', router)
}
module.exports = initApiRoute