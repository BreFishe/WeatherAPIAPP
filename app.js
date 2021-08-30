const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let zip = ""

app.get("/", function(req,res){
    res.render("input", {zipWeather : zip});
})

app.post("/",function (req,res) {

    // console.log(req.body.result);
    // console.log("Hello");

    if(req.body === 1) {
        res.redirect("/input");
    }

    let zip = req.body.cityZip;
    const url = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&appid=d5cac1be3b62aca2fcfebdd9ef4dad42&units=imperial#";
    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            // if(req.body.list === "Work"){
            //     res.redirect("/work");
            // }

            if(response.statusCode>=400) {
                console.log("broke");
                res.render("fail", {sentZip: zip});
            }
            else {
                //console.log(weatherData);
                const townName = weatherData.name;
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                console.log(temp);
                const icon = weatherData.weather[0].icon;
                const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                res.render("display", {sentTownName : townName, sentTemp: temp, sentDesc: desc, sentImage: imageUrl});
            }
        });
    });
});

app.listen(3000, function() {
    console.log("Server is up on 3000");
});

app.post("/fail",function (req,res) {
    res.redirect("/");
});

app.post("/display",function (req,res) {
    res.redirect("/");
});