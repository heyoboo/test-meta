const fetch = require("node-fetch");
var express = require('express');
var bodyParser = require('body-parser');
const fs = require("fs");
var app = express();

process.env.MESSAGE_STYLE = 'uppercase';

// console.log("Hello World");

app.use("/public", express.static(__dirname + "/public", { etag: false, maxAge: 0 }));
``

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

let htmlContent = fs.readFileSync(__dirname + "/views/index.html", "utf8");


app.get("/", function(req, res) {
  var path = __dirname + "/views/index.html";
  res.sendFile(path);
});


app.get("/name", function(req, res) {
  var firstName = req.query.first;
  var lastName = req.query.last;
  console.log(firstName, lastName);
  res.json({ name: `${firstName} ${lastName}` });
});


app.post("/name", function(req, res) {
  // Handle the data in the request
  var fullName = req.body.first + " " + req.body.last;
  res.send(`<h1>${fullName}, you rock 👊🏻</h1>`);
});


app.get("/:word/echo", function(req, res) {
  console.log(req.params.word);
  res.json({ echo: req.params.word });
});

app.get("/now", function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  let html = htmlContent

  const testFnc = async () => {
    console.log('testtest')
    const url = "https://payment.chapter-i.com/campaign?uid=Web%20Store"
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
    });
    const cmapaignRes = await response.json();
    const desc = cmapaignRes.campaignDescription
    const icon = cmapaignRes.logoImage
    console.log({desc, icon})
    html = html.replace("__TITLE__", desc);
    html = html.replace("__DESCRIPTION__", desc);
    html = html.replace("__ICON__", icon);
    html = html.replace("__OG_SITE_NAME__", desc);
    html = html.replace("__OG_TITLE__", desc);
    html = html.replace("__OG_DESCRIPTION__", desc);
    html = html.replace("__OG_ICON__", icon);

    console.log(html, "time")
    res.send(html + req.time)
  }
  testFnc()
});


app.get("/page", function(req, res) {
  let html = htmlContent
  html = html.replace("__TITLE__", "this is a page duh");
  html = html.replace("__DESCRIPTION__", "page page page page page");
  console.log(
    html, "page");
  res.send(html);
});


app.get("/json", function(req, res) {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    return res.json({ "message": "HELLO JSON" });
  }
  else {
    return res.json({ "message": "Hello json" });
  }
});








































module.exports = app;
