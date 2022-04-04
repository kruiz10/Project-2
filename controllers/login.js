let mysql = require("mysql")
let path = require("path")
let fs = require("fs")


let logged_in = ''
let publicDirectory = path.join(__dirname, '..')


let database = mysql.createPool({
    host : "107.180.1.16",
    database : "sprog2022team11",
    user : "sprog2022team11",
    password : "springog2022team11"
})

exports.login = async (req, res) => {
    try {

        let {username, password} = req.body

        if ( !username || !password ) {
            console.log("no email or password")
        }

        database.query('SELECT * FROM Users WHERE Email = ?', [username], async (error, results) => {

            if( !results || password != results[0].Password) {
                console.log(password)
                console.log(results[0])
                console.log('Email or password incorrect')
                
            }

            else {
                
                logged_in = results[0]
                console.log(`User ${logged_in.FirstName} ${logged_in.LastName} has logged in`)
                res.sendFile(publicDirectory + '/public/MainPage.html')
            }
        })
    } catch (error) {
        console.log(error)
    }
}