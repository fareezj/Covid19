var express    = require("express"),
    request    = require("request"),
    bodyParser = require("body-parser");

    app = express();


    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine", "ejs");


//VALIDATE JSON
function fetchJSON(url){
    return new Promise((resolve, reject) => {
        request(url, function(err, res, body) {
            if (err) {
                reject(err);
              } else if (res.statusCode !== 200) {
                reject(new Error('Failed with status code ' + res.statusCode));
              } else {
                resolve(JSON.parse(body));
              }
        });
    });
}

    app.get("/", function(req, res){
        const p1 = fetchJSON("https://covidapi.info/api/v1/global");
        const p2 = fetchJSON("https://covidapi.info/api/v1/global/count");

        Promise.all([p1, p2]).then((data) => {
            res.render("home", {a: data[0], chart: data[1]});
        })
        .catch(err => console.error("There was an error", err));
    });

    // app.get("/", function(req, res){
    //     request("https://covidapi.info/api/v1/global", function(error, respond, body){
    //         if(!error && respond.statusCode == 200){
    //             var data = JSON.parse(body);
    //             res.render("home", {data: data});
    //         }
    //     });
    // });

    app.get("/details", function(req, res){
        res.render("searchCountry");
    });

    app.get("/allStats", function(req, res){
        request("https://api.covid19api.com/summary", function(error, respond, body){
            if(!error && respond.statusCode == 200){
                var data = JSON.parse(body);
                res.render("showAllStats", {data: data["Countries"]});
                
            }
        });
    });

    app.get("/search", function(req, res){
        var country = req.query.search;
        var status = req.query.status;
        var url = "https://api.covid19api.com/country/" + country + "/status/" + status + "/live"; 
        request(url, function(error, respond, body){
            if(!error && respond.statusCode == 200){
                var data = JSON.parse(body);
                res.render("results", {data: data , status: status, country: country});
                
            }
        });
    });





app.listen(process.env.PORT || 3000, function(){
	console.log("COVID-19 server has started")
});