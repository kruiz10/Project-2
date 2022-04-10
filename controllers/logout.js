let mysql = require("mysql")
let path = require("path")
let fs = require("fs")
let cheerio = require('cheerio')


let logged_in = ''
let publicDirectory = path.join(__dirname, '..')


let database = mysql.createPool({
    host : "107.180.1.16",
    database : "sprog2022team11",
    user : "sprog2022team11",
    password : "springog2022team11"
})

exports.logout = (req, res) => {
    
    logged_in = ''    

    let publicDirectory = path.join(__dirname, '..')
    res.sendFile(publicDirectory + '/public/HomePage.html')
}