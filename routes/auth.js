let express = require('express')
let loginController = require('../controllers/login')
let router = express.Router()




router.post('/login', loginController.login)




module.exports = router