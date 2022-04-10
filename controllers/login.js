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
                
                let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/MainPage.html'))
                
                
                //console.log($.html())
                res.sendFile(publicDirectory + '/public/MainPage.html')
                
            }
        })
    } catch (error) {
        console.log(error)
    }
}

exports.settings = async (req, res) => {
    let publicDirectory = path.join(__dirname, '..')

    let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/Settings.html'))

    $("#FirstName").val(logged_in.FirstName)
    $("#LastName").val(logged_in.LastName)
    $("#Email").val(logged_in.Email)
    $("#PhoneNumber").val(logged_in.PhoneNumber)
    
    $("#Interest1").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest1) {
        
            $(op).html($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
            //$(op).replaceWith($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
        }
    })

    $("#Interest2").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest2) {
            $(op).html($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')   
        }  
    })
    
    $("#Interest3").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest3) {
            $(op).html($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')   
        } 
    })
    
    $("#Interest4").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest4) {
            $(op).html($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>') 
        }
        
    })
    
    $("#Interest5").find("option").each((i, op) => {
        
        if ($(op).html() === logged_in.Interest5) {
            $(op).html($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
        }     
    })
    
   if (logged_in.Mentor === 0) {
    
    $("#Mentor").replaceWith($.html("#Mentor").slice(0, 7) + 'checked ' + $.html("#Mentor").slice(7, -1) + '>')
   }
   else {
    $("#Mentee").replaceWith($.html("#Mentee").slice(0, 7) + 'checked ' + $.html("#Mentee").slice(7, -1) + '>')
   }


    let htmldata = $.html()
    
    
    fs.writeFile(publicDirectory + '/public/Settings.html', htmldata, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('res.writefile worked')
            fs.readFile(publicDirectory + '/public/Settings.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.sendFile(publicDirectory + '/public/Settings.html')
                }
            })
        }
    })

}

exports.update = async (req, res) => {
    console.log('update worked')
    let {
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Mentor,
        Interest1,
        Interest2,
        Interest3,
        Interest4,
        Interest5
    } = req.body   
    
    let id = logged_in.idUsers
    
    database.query(`UPDATE Users SET ? WHERE idUsers = '${id}'`, {
        FirstName: FirstName,
        LastName: LastName,
        Email: Email,
        PhoneNumber: PhoneNumber,
        Mentor: Mentor,
        Interest1: Interest1,
        Interest2: Interest2,
        Interest3: Interest3,
        Interest4: Interest4,
        Interest5: Interest5 }, (error, results) => {
            if(error) {
                console.log(error)
            }
            else {
                console.log("user updated")
                let publicDirectory = path.join(__dirname, '..')

            
                res.sendFile(publicDirectory + '/public/MainPage.html')
            }
        })

}

exports.logout = (req, res) => {
    
    logged_in = ''    

    let publicDirectory = path.join(__dirname, '..')

    let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/HomePage.html'))

    let htmldata = $.html()
    
    fs.writeFile(publicDirectory + '/public/HomePage.html', htmldata, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log('res.writefile worked')
            fs.readFile(publicDirectory + '/public/HomePage.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.sendFile(publicDirectory + '/public/HomePage.html')
                }
            })
        }
    })
}

