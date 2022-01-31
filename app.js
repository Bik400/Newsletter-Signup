const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName
               }  
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/d9006378d2";

    const options = {
        method: "POST",
        auth: "bikram1:fde772d336ef751f8b525c6b62cfe168-us2"
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function (req, res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
})

//API Key 
// fde772d336ef751f8b525c6b62cfe168-us2

//List ID
// d9006378d2