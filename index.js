// const HTMLPage= fs.readFileSync(`${__dirname}/projectSrc/index.html`, "utf-8");
// const page1= fs.readFileSync(`${__dirname}/projectSrc/page1.html`, "utf-8");
// const page2= fs.readFileSync(`${__dirname}/projectSrc/page2.html`, "utf-8");
//const LoginPage= fs.readFileSync(`${__dirname}/projectSrc/login.html`, "utf-8");  //found an information with this async file reading. If it doesn't immidiately find/read the file, its gonna throw an error and will not start the server







// main node module
const fs= require("fs");
const express= require('express');
const app = express();
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());



// app.use(express.urlencoded()); //this one is deprecated
app.use(express.urlencoded({ extended: true }));


const functionsModule = require(`${__dirname}/functions.js`);
const ModuleBind= functionsModule.moduleFunction;


// fetching database
const userInfo= fs.readFileSync(`${__dirname}/database/userinfo.json`, "utf-8");


//fetching component
const pageHeader= fs.readFileSync(`${__dirname}/projectSrc/component/header.html`, "utf-8");


// fetching stylesheet
const indexPageStyle= fs.readFileSync(`${__dirname}/projectSrc/src/css/index.css`, "utf-8");


// fetching HTML page
const FileSystem={
    //HTML FILE
    HTMLPage:fs.readFileSync(`${__dirname}/projectSrc/index.html`, "utf-8"),
    page1:fs.readFileSync(`${__dirname}/projectSrc/page1.html`, "utf-8"),
    page2:fs.readFileSync(`${__dirname}/projectSrc/page2.html`, "utf-8"),
    LoginPage: fs.readFileSync(`${__dirname}/projectSrc/login.html`, "utf-8"),



    //STYLESHEET COMPONENT
    UniversalStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/component/_universal.css`, "utf-8"),
    Navigation: fs.readFileSync(`${__dirname}/projectSrc/src/css/component/_navigation.css`, "utf-8"),



    //STYLESHEET
    LoginPageStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/login.css`, "utf-8"),
    HomePageStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/index.css`, "utf-8"),
}


            
// replace middleware
let replacedCode;
const replaceCode=(element)=>{
    let replaceTemp;
    if(element === FileSystem.HTMLPage){
        replaceTemp = pageHeader.replace("%%HeaderTitle%%", "Connectify-Home");
        replaceTemp= replaceTemp.replace("<!-- **icon** -->", `<link rel="icon/image" href="${__dirname}/projectSrc/src/img/favicon.png">`)
        //BIND styles
        let BINDED = ModuleBind.BindComponent([FileSystem.HomePageStyles,FileSystem.UniversalStyles, FileSystem.Navigation]);
        replaceTemp= replaceTemp.replace("/*%%styles%%*/", BINDED);
    }
    else if(element===FileSystem.LoginPage){
        replaceTemp = pageHeader.replace("%%HeaderTitle%%", "Connectify-Login"); 
        let BINDED = ModuleBind.BindComponent([FileSystem.LoginPageStyles,FileSystem.UniversalStyles, FileSystem.Navigation]);
        replaceTemp= replaceTemp.replace("/*%%styles%%*/", BINDED);
    }
    else{
        console.log("no page title"); 
    }

    replacedCode= element.replace("%%Head%%", replaceTemp);
}


 
app.get("/", (req,res)=>{ 
    replaceCode(FileSystem.HTMLPage);
    res.writeHead(200, {
        "content-type":"text/html" 
    });

    res.end(replacedCode);
});


app.get("/login", (req, res)=>{
    replaceCode(FileSystem.LoginPage);
    res.writeHead(200, {
        "content-type":"text/html" 
    });

    res.end(replacedCode);
})


app.get("/Page1", (req,res)=>{
    let y = JSON.parse(userInfo)
    console.log(y.mahinul9);
    res.writeHead(200, {
        "content-type":"text/html"
    })
    res.end(FileSystem.page1);
});


app.get("/Page2", (req,res)=>{
    let y = JSON.parse(userInfo)
    console.log(y.mahinul9);
    res.writeHead(200, {
        "content-type":"text/html"
    })
    res.end(FileSystem.page2);
});


//login section
app.post("/login",(req,res)=>{
    let username= req.body.username;
    let password=req.body.password;
    
    //now I have the password, what should I do?
    //it will route to specific 
    let authResult =ModuleBind.Authentication(username, password);
    if(authResult===true){
        console.log("continue to login");
        res.cookie("username",username);
        res.cookie('password', password);
        res.redirect("/");
    }
    // res.end(replaceCode(FileSystem.HTMLPage));
     
})



app.listen(8000, ()=>{
    console.log("listening to the port 8000");
});