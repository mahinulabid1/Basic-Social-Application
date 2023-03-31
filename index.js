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
const postData = fs.readFileSync(`${__dirname}/database/postdata.json`, "utf-8");


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
    NewsfeedStyle: fs.readFileSync(`${__dirname}/projectSrc/src/css/newsfeed.css`, "utf-8"),
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






// NEWSFEED ROUTING  
router.get("/newsfeed", (req, res) => {
    let cookiesFetch = req.cookies;
    let username = cookiesFetch.username;
    let fullname;

    replaceCode(FileSystem.Newsfeed);
    res.writeHead(200, {
        "content-type": "text/html"
    });


    //replacing user information
    let newLogOutBtn = `<a href="http://127.0.0.1:8000/logout">Log Out</a>`
    replacedCode = replacedCode.replace(`<a href="http://127.0.0.1:8000/login">Log In</a>`, newLogOutBtn);
    replacedCode = replacedCode.replace("%%username%%", `@${username}`);
    let data = JSON.parse(userInfo);
    for (let i = 0; i < data.length; i++) {
        // after reading the username cookies search in database about this user and fetch its FULL NAME
        if (data[i].userid === cookiesFetch.username) {
            fullname = data[i].fullname;
        }
    }
    // Replacing the full name
    replacedCode = replacedCode.replace("%%fullname%%", fullname);

    // replace status section where many content will contain
    let Element = "";
    let PostData = JSON.parse(postData);
    for (let i = 0; i < PostData.length; i++) {
        let username = PostData[i].username;
        let postContent = PostData[i].postContent;
        let postDate = PostData[i].date;

        let ConcatEl = `
        <div class="thestatus">
            <h6 class="status-username">@${username}</h6>
            <p class="date-of-status">$${postDate}</p>
            <p class="status-data">${postContent}</p>
            <hr>
            <!--<button class="like-to-post">Like</button> -->
        </div>
        `;
        Element = Element.concat(ConcatEl);
    }
    replacedCode = replacedCode.replace("<!-- %%thestatus%% -->", Element);


    res.end(replacedCode);
}).post("/newsfeed", (req, res) => {
    let status = req.body.createpost;
    let getUsername = req.cookies.username;

    // date function
    let date = new Date();
    let fullDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    let fullTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    // let Month = date.getMonth();
    // let Day = date.getDate();
    // let Year = date.getFullYear();

    // // time (for status precedence in newsfeed);
    // let Hour = date.getHours();
    // let Seconds = date.getSeconds();
    // let Minutes = date.getMinutes();

    let data = {
        username: getUsername,
        postContent: status,
        date: fullDate,
        time: fullTime

    }

    let PostData = JSON.parse(postData);
    PostData.push(data);
    PostData = JSON.stringify(PostData);
    console.log(PostData);

    fs.writeFileSync(`${__dirname}/database/postdata.json`, PostData);

    res.redirect("/newsfeed");


});


router.get("/userCheckInLogin",(req,res)=>{  
    console.log("got check req");
    let y= ""; 
    console.log(req.query.username);  
    let userDataBase = JSON.parse(userInfo);
    for(let i=0; i < userDataBase.length; i++){
        if(userDataBase[i].userid== req.query.username){
            y = "username found";
            break;
        }else{
            y= "username not found";  
        }
    }
       
    res.send(y);             
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
    res.cookie('password', password);   //middleware
    res.redirect("/newsfeed");

});


router.get("/logout", (req, res) => {
    res.clearCookie("username");
    res.clearCookie("password");
    res.redirect("/");
})



// this app.use(router); must be at the bottom of all routing
app.use(router);

//module for creating port, it needs to be at the bottom of the page
app.listen(8000, () => {
    console.log("listening to the port 8000");
});