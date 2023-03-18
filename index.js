// const HTMLPage= fs.readFileSync(`${__dirname}/projectSrc/index.html`, "utf-8");
// const page1= fs.readFileSync(`${__dirname}/projectSrc/page1.html`, "utf-8");
// const page2= fs.readFileSync(`${__dirname}/projectSrc/page2.html`, "utf-8");
//const LoginPage= fs.readFileSync(`${__dirname}/projectSrc/login.html`, "utf-8");  //found an information with this async file reading. If it doesn't immidiately find/read the file, its gonna throw an error and will not start the server







// main node module
const fs = require("fs");
const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const router = express.Router();


app.use(express.json());
app.use(cookieParser());



// app.use(express.urlencoded()); //this one is deprecated
app.use(express.urlencoded({ extended: true }));


const functionsModule = require(`${__dirname}/functions.js`);
const ModuleBind = functionsModule.moduleFunction;


// fetching database
const userInfo = fs.readFileSync(`${__dirname}/database/userinfo.json`, "utf-8");


//fetching component
const pageHeader = fs.readFileSync(`${__dirname}/projectSrc/component/header.html`, "utf-8");


// fetching stylesheet
const indexPageStyle = fs.readFileSync(`${__dirname}/projectSrc/src/css/index.css`, "utf-8");


// fetching HTML page 
const FileSystem = {   
    //HTML FILE
    HTMLPage: fs.readFileSync(`${__dirname}/projectSrc/index.html`, "utf-8"),
    page1: fs.readFileSync(`${__dirname}/projectSrc/page1.html`, "utf-8"),
    page2: fs.readFileSync(`${__dirname}/projectSrc/page2.html`, "utf-8"), 
    LoginPage: fs.readFileSync(`${__dirname}/projectSrc/login.html`, "utf-8"),
    Newsfeed: fs.readFileSync(`${__dirname}/projectSrc/newsfeed.html`, "utf-8"),
    CreateAccount: fs.readFileSync(`${__dirname}/projectSrc/createAccount.html`, "utf-8"),



    //STYLESHEET COMPONENT
    UniversalStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/component/_universal.css`, "utf-8"),
    Navigation: fs.readFileSync(`${__dirname}/projectSrc/src/css/component/_navigation.css`, "utf-8"),



    //STYLESHEET
    LoginPageStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/login.css`, "utf-8"),
    HomePageStyles: fs.readFileSync(`${__dirname}/projectSrc/src/css/index.css`, "utf-8"),
    CreateAccountStyleSheet: fs.readFileSync(`${__dirname}/projectSrc/src/css/createAccount.css`, "utf-8"),
    NewsfeedStyle:  fs.readFileSync(`${__dirname}/projectSrc/src/css/newsfeed.css`, "utf-8"),
}




// cookie checker 
checkForCookies = (req) => {
    let Cookies = req;
    if ((Cookies.username) === undefined) {
        return false;
    } else {
        return (Cookies.username);
    }
}


// replace middleware
let replacedCode;
const replaceCode = (element) => {
    let replaceTemp;
    switch (element) {

        //note that it also takes the "element" and manipulate it and returns in an object from the function BindManager()
        case FileSystem.HTMLPage:
            replaceTemp = ModuleBind.BindManager("Connectify-Home", [FileSystem.HomePageStyles, FileSystem.UniversalStyles, FileSystem.Navigation], element);
            break;

        case FileSystem.LoginPage:
            replaceTemp = ModuleBind.BindManager("Connectify-Login", [FileSystem.LoginPageStyles, FileSystem.UniversalStyles, FileSystem.Navigation], element);
            break;

        case FileSystem.CreateAccount:
            replaceTemp = ModuleBind.BindManager("Connectify-Create Account", [FileSystem.CreateAccountStyleSheet, FileSystem.UniversalStyles, FileSystem.Navigation], element);
            break;
        
        case FileSystem.Newsfeed:
            replaceTemp = ModuleBind.BindManager("Connectify-NewsFeed", [FileSystem.NewsfeedStyle, FileSystem.UniversalStyles, FileSystem.Navigation], element);
            break;

        default:
            console.log("no page title");
    }

 


    replacedCode = replaceTemp.htmlBind.replace("%%Head%%", replaceTemp.tempMem);
}



router.get("/", (req, res) => {
    let x = checkForCookies(req.cookies);
    if (x === false) {
        replaceCode(FileSystem.HTMLPage);
        res.writeHead(200, {
            "content-type": "text/html"
        });

        res.end(replacedCode);
    } else if (x !== false) {
        res.redirect("/newsfeed");
    }
});


router.get("/login", (req, res) => {
    let x = checkForCookies(req.cookies);
    if (x === false) {
        replaceCode(FileSystem.LoginPage);
        res.writeHead(200, {
            "content-type": "text/html"
        });

        res.end(replacedCode);
    } else if (x !== false) {
        res.redirect("/newsfeed");
    }
}).post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    //now I have the password, what should I do?
    //it will route to specific 
    let authResult = ModuleBind.Authentication(username, password);
    if (authResult === true) {
        console.log("continue to login");
        res.cookie("username", username);
        res.cookie('password', password);
        res.redirect("/newsfeed");
    } else {
        res.redirect("/login");
    }
})


// app.get("/Page1", (req, res) => {
//     let y = JSON.parse(userInfo)
//     console.log(y.mahinul9);
//     res.writeHead(200, {
//         "content-type": "text/html"
//     })
//     res.end(FileSystem.page1);
// });


// app.get("/Page2", (req, res) => {
//     let y = JSON.parse(userInfo)
//     console.log(y.mahinul9);
//     res.writeHead(200, {
//         "content-type": "text/html"
//     })
//     res.end(FileSystem.page2);
// });


//login section
// app.post("/login", (req, res) => {
//     let username = req.body.username;
//     let password = req.body.password;

//     //now I have the password, what should I do?
//     //it will route to specific 
//     let authResult = ModuleBind.Authentication(username, password);
//     if (authResult === true) {
//         console.log("continue to login");
//         res.cookie("username", username);
//         res.cookie('password', password);
//         res.redirect("/newsfeed");
//     } else {
//         res.redirect("/login");
//     }
// })





router.get("/newsfeed", (req, res) => {
    replaceCode(FileSystem.Newsfeed);
    res.writeHead(200, {
        "content-type": "text/html"
    });

    res.end(replacedCode);
});






router.get("/newAccount", (req, res) => {
    let x = checkForCookies(req.cookies);
    if (x === false) {
        replaceCode(FileSystem.CreateAccount);
        res.writeHead(200, {
            "content-type": "text/html"
        });
        res.end(replacedCode);

    }
    else if (x !== false) {
        res.redirect("/newsfeed");
    }


}).post("/newAccount", (req, res) => {
    let Fullname = req.body.full_name;
    let username = req.body.username;
    let password = req.body.password;
    let data = JSON.parse(userInfo);

    data.push({ userid: username, password: password, fullname: Fullname });
    data = JSON.stringify(data);
    res.writeHead(200, {
        "content-type": "application/json"
    });
    console.log(data);
    fs.writeFileSync(`${__dirname}/database/userinfo.json`, data);
    res.cookie("username", username);
    res.cookie('password', password);
    res.redirect("/newsfeed");

})

// app.post("/newAccount", (req, res) => {
//     let Fullname = req.body.full_name;
//     let username = req.body.username;
//     let password = req.body.password;
//     let data = JSON.parse(userInfo);

//     data.push({ userid: username, password: password, fullname: Fullname });
//     data = JSON.stringify(data);
//     res.writeHead(200, {
//         "content-type": "application/json"
//     });
//     console.log(data);
//     fs.writeFileSync(`${__dirname}/database/userinfo.json`, data);
//     res.cookie("username", username);
//     res.cookie('password', password);
//     res.redirect("/newsfeed");

// })





// this app.use(router); must be at the bottom of all routing
app.use(router);

//module for creating port, it needs to be at the bottom of the page
app.listen(8000, () => {
    console.log("listening to the port 8000");
});