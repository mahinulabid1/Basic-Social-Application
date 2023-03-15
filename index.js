// main node file
const fs= require("fs");
const express= require('express');
const app = express();

const userInfo= fs.readFileSync(`${__dirname}/database/userinfo.json`, "utf-8");
const HTMLPage= fs.readFileSync(`${__dirname}/projectSrc/index.html`);
const page1= fs.readFileSync(`${__dirname}/projectSrc/page1.html`);
const page2= fs.readFileSync(`${__dirname}/projectSrc/page2.html`);


app.get("/", (req,res)=>{
    let y = JSON.parse(userInfo)
    console.log(y.mahinul9);
    res.writeHead(200, {
        "content-type":"text/html"
    })
    res.end(HTMLPage);
});


app.get("/Page1", (req,res)=>{
    let y = JSON.parse(userInfo)
    console.log(y.mahinul9);
    res.writeHead(200, {
        "content-type":"text/html"
    })
    res.end(page1);
});


app.get("/Page2", (req,res)=>{
    let y = JSON.parse(userInfo)
    console.log(y.mahinul9);
    res.writeHead(200, {
        "content-type":"text/html"
    })
    res.end(page2);
});



app.listen(8000, ()=>{
    console.log("listening to the port 8000");
});