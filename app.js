let express = require("express")
let mysql = require("mysql")
let path = require("path")
let router = express.Router()

let app = express()

app.listen(8080, () => {
    console.log("Server started on port 8080")
})

let database = mysql.createPool({
    host : "107.180.1.16",
    database : "sprog2022team11",
    user : "sprog2022team11",
    password : "springog2022team11"
})

let publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.use(express.urlencoded({extended: false}))
app.use(express.json())


database.getConnection((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("mySQL connected")
    }
})

app.get("/", (req, res) => {
    //res.render('/Home')
    res.sendFile(__dirname + "/public/HomePage.html")
})

app.use('/auth', require('./routes/auth'))