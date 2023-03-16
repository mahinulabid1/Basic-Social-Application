// main node file
const fs= require("fs");
const express= require('express');
const app = express();


// fetching database
const userInfo= fs.readFileSync(`${__dirname}/database/userinfo.json`, "utf-8");


//fetching component
const pageHeader= fs.readFileSync(`${__dirname}/projectSrc/component/header.html`, "utf-8");


// fetching stylesheet
const indexPageStyle= fs.readFileSync(`${__dirname}/projectSrc/src/css/index.css`, "utf-8");


// fetching HTML page
const HTMLPage= fs.readFileSync(`${__dirname}/projectSrc/index.html`, "utf-8");
const page1= fs.readFileSync(`${__dirname}/projectSrc/page1.html`, "utf-8");
const page2= fs.readFileSync(`${__dirname}/projectSrc/page2.html`, "utf-8");


// replace middleware
let replacedCode;
const replaceCode=(element)=>{
    let replaceTemp;
    if(element === HTMLPage){
        replaceTemp = pageHeader.replace("%%HeaderTitle%%", "Connectify-Home");
        replaceTemp= replaceTemp.replace("%%styles%%", indexPageStyle);
    }
    else{
        console.log("no page title"); 
    }

    replacedCode= element.replace("%%Head%%", replaceTemp);
}



app.get("/", (req,res)=>{ 
    // let y = JSON.parse(userInfo)
    // console.log(y.mahinul9);
    replaceCode(HTMLPage);
    res.writeHead(200, {
        "content-type":"text/html" 
    });

    res.end(replacedCode);
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