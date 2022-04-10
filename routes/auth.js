let express = require('express')
let loginController = require('../controllers/login')


let router = express.Router()




router.post('/login', loginController.login)
router.post('/logout', loginController.logout)
router.post('/settings', loginController.settings)
router.post('/update', loginController.update)




module.exports = router