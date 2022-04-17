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
                console.log(logged_in)

                database.query('select * from Users', (error, results) => {
                    let matches = []
                   
                    let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/MainPage.html'))
                    if (error) {
                        console.log(error)
                    }
                    else {
                        for (let i = 0; i < results.length; i++) {
                            if ((results[i].Interest1 === logged_in.Interest1 ||
                                results[i].Interest2 === logged_in.Interest2 ||
                                results[i].Interest3 === logged_in.Interest3) &&
                                results[i].Email != logged_in.Email && 
                                results[i].Mentor != logged_in.Mentor){

                                matches.unshift(results[i])

                              
                                  
                            }
                        }

                        $("#Users").replaceWith(`
                        <table id="Users">
                            <th>Name</th>
                            <th>Mentorship Interests</th>
                            <th>Contact Info</th>
                        </table>
                        `)

                        for(let i = 0; i < matches.length; i++) {

                            $("#Users").append(`
                            <tr>
                                <th>${matches[i].FirstName} ${matches[i].LastName}</th>
                                <th>${matches[i].Interest1},  ${matches[i].Interest2},  ${matches[i].Interest3}</th>
                                <th>
                                    <div class="dropdown">
                                        <button class="dropbtn">Connect</button>
                                        <div class="dropdown-contactInfo">
                                            <a href="tel:${matches[i].PhoneNumber}">Call</a>
                                            <a href="mailto:${matches[i].Email}">Email</a>             
                                        </div>
                                </th>
                            </tr>
                            `)
                            
                        }
                        
                    }
                    let htmldata = $.html()
    
    
                    fs.writeFile(publicDirectory + '/public/MainPage.html', htmldata, (err) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                           
                            fs.readFile(publicDirectory + '/public/MainPage.html', 'utf-8', (err, data) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    res.sendFile(publicDirectory + '/public/MainPage.html')
                                }
                            })
                        }
                    })
                })
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
    
    /*$("#Interest1").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest1) {
        
            //console.log($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
            $(op).replaceWith($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
        }
    })

    $("#Interest2").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest2) {
            $(op).replaceWith($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
        }  
    })
    
    $("#Interest3").find("option").each((i, op) => {
        if ($(op).html() === logged_in.Interest3) {
            $(op).replaceWith($.html(op).slice(0, 8) + 'selected ' + $.html(op).slice(8, -1) + '>')
        } 
    })
    
   if (logged_in.Mentor === 0) {

    $("#Mentor").replaceWith($.html("#Mentor").slice(0, 7) + 'checked ' + $.html("#Mentor").slice(7, -1) + '>')   
    $("#Mentee").replaceWith($.html("#Mentee").slice(0, 7) + '' + $.html("#Mentee").slice(7, -1) + '>')
   }
   else {
    $("#Mentee").replaceWith($.html("#Mentee").slice(0, 7) + 'checked ' + $.html("#Mentee").slice(7, -1) + '>')
    $("#Mentor").replaceWith($.html("#Mentor").slice(0, 7) + '' + $.html("#Mentor").slice(7, -1) + '>')
   }*/

   

    let htmldata = $.html()
    
    
    fs.writeFile(publicDirectory + '/public/Settings.html', htmldata, (err) => {
        if (err) {
            console.log(err)
        }
        else {
           
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
    
    let {
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Mentor,
        Interest1,
        Interest2,
        Interest3
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
        Interest3: Interest3 }, (error, results) => {
            if(error) {
                console.log(error)
            }
            else {
                console.log("user updated")
                
                /*database.query(`SELECT * FROM Users WHERE idUsers = '${id}'`, (error, results) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        logged_in = results[0]
                    }
                })*/

                logged_in.FirstName = FirstName
                logged_in.LastName = LastName
                logged_in.Email = Email
                logged_in.PhoneNumber = PhoneNumber
                logged_in.Mentor = Mentor
                logged_in.Interest1 = Interest1
                logged_in.Interest3 = Interest2
                logged_in.Interest3 = Interest3

            
                
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

exports.profile = (req, res) => {
 
    
    let publicDirectory = path.join(__dirname, '..')

    let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/Profile.html'))

    $("#name").text(logged_in.FirstName + ' ' + logged_in.LastName)
    $("#Email").text(logged_in.Email)
    $("#PhoneNumber").text(logged_in.PhoneNumber)
    $("#Interest1").text(logged_in.Interest1)
    $("#Interest2").text(logged_in.Interest2)
    $("#Interest3").text(logged_in.Interest3)

    let htmldata = $.html()
    
    fs.writeFile(publicDirectory + '/public/Profile.html', htmldata, (err) => {
        if (err) {
            console.log(err)
        }
        else {
           
            fs.readFile(publicDirectory + '/public/Profile.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.sendFile(publicDirectory + '/public/Profile.html')
                }
            })
        }
    })
}

exports.main = (req, res) => {
    
    database.query('select * from Users', (error, results) => {
        let matches = []

        let $ = cheerio.load(fs.readFileSync(publicDirectory + '/public/MainPage.html'))
        if (error) {
            console.log(error)
        }
        else {
            for (let i = 0; i < results.length; i++) {
                if ((results[i].Interest1 === logged_in.Interest1 ||
                    results[i].Interest2 === logged_in.Interest2 ||
                    results[i].Interest3 === logged_in.Interest3) &&
                    results[i].Email != logged_in.Email && 
                    results[i].Mentor != logged_in.Mentor) {

                    matches.unshift(results[i])
                }
            }

            $("#Users").replaceWith(`
            <table id="Users">
                <th>Name</th>
                <th>Mentorship Interests</th>
                <th>Contact Info</th>
            </table>
            `)

            for(let i = 0; i < matches.length; i++) {


                $("#Users").append(`
                <tr>
                    <th>${matches[i].FirstName} ${matches[i].LastName}</th>
                    <th>${matches[i].Interest1},  ${matches[i].Interest2},  ${matches[i].Interest3}</th>
                    <th>
                        <div class="dropdown">
                            <button class="dropbtn">Connect</button>
                            <div class="dropdown-contactInfo">
                                <a href="tel:${matches[i].PhoneNumber}">Call</a>
                                <a href="mailto:${matches[i].Email}">Email</a>             
                            </div>
                    </th>
                </tr>
                `)
                
            }
            
        }
        let htmldata = $.html()


        fs.writeFile(publicDirectory + '/public/MainPage.html', htmldata, (err) => {
            if (err) {
                console.log(err)
            }
            else {
               
                fs.readFile(publicDirectory + '/public/MainPage.html', 'utf-8', (err, data) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.sendFile(publicDirectory + '/public/MainPage.html')
                    }
                })
            }
        })
    })

}

exports.register = (req, res) => {

   
    
    let {
        FirstName, 
        LastName, 
        password, 
        Verifypassword, 
        Email,
        PhoneNumber,
        Interest1,
        Interest2,
        Interest3,
        Mentor
    } = req.body

    database.query('SELECT email FROM Users WHERE email = ?', [Email], (error, results) => {
        if(error) {
            console.log(error)
        }

        if(results.length > 0) {
            console.log("Email already in use")
            
        }
        else if (password !== Verifypassword) {
            console.log("passwords do not match")
            console.log(password)
            console.log(Verifypassword)
            
        }

        database.query('INSERT INTO Users SET ?', {
       
            FirstName: FirstName, 
            LastName: LastName, 
            Email: Email, 
            Password: password, 
            PhoneNumber: PhoneNumber,
            Interest1: Interest1,
            Interest2: Interest2,
            Interest3: Interest3,
            Mentor: Mentor }, (error, results) => {
                if(error) {
                    console.log(error)
                }
                else {
                    console.log("user registered")
                    let publicDirectory = path.join(__dirname, '..')

                
                    res.sendFile(publicDirectory + '/public/HomePage.html')
                }
            })
    })

}