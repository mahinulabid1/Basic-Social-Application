const fs= require('fs');
// var express = require('express');
// var cookieParser = require('cookie-parser');

// var app = express();
// app.use(cookieParser());



const userNameCheck= fs.readFileSync(`${__dirname}/database/userinfo.json`, "utf-8");
const pageHeader = fs.readFileSync(`${__dirname}/projectSrc/component/header.html`, "utf-8");
const inspectTool=fs.readFileSync(`${__dirname}/projectSrc/component/inspecttools.html`, "utf-8");
const navigation=fs.readFileSync(`${__dirname}/projectSrc/component/navigation.html`, "utf-8");


exports.moduleFunction={
    BindComponent:(bindarr)=>{
        // BIND COMPONENT TAKES TWO ARGUMENT
        //FIRST ARGUMENT IS THE SUBJECT FILE WHERE I WILL REPLACE CERTAIN PART
        //SECOND ARGUMENT WILL BE AN ARRAY 
        let tempmemory="";
        for(let i =0;i < bindarr.length; i++){
            tempmemory=tempmemory.concat(bindarr[i]);
        }

        return tempmemory;
        // this returns a binded chunk of same group code like js, css, html
    },





    Authentication:(username,password)=>{
        let Switch;
        let passwordFromData;
        
        let data= JSON.parse(userNameCheck);
        // console.log(data);

        for(let i=0;i<data.length;i++){
            // console.log(data[i]);

            if(data[i].userid===username){
                //this means username matched

                passwordFromData=data[i].password;
                console.log("username matched");

                //if username found in database then return true
                Switch=true; 
                break;
            }else{
                Switch=false;
                passwordFromData="null";
            }
        }

        if(Switch===true){
            //check if password match
            if(password ===passwordFromData){
                console.log("password match");
                return true;
            }else{
                console.log("password didnt match");
                console.log(passwordFromData);
            }
        }

        
    },



    BindManager: (websiteTitle, moduleBindArr, htmlElement)=>{
        let tempMem;
        let htmlBind;

        // websiteTitle = the text will be at <head> <title> the text </title> </head>
        // moduleBindArr = all the binding element will be binded


        //website title
        tempMem=pageHeader.replace("%%HeaderTitle%%", websiteTitle);
        let BINDED = this.moduleFunction.BindComponent(moduleBindArr);
        tempMem= tempMem.replace("/*%%styles%%*/", BINDED);
        
        //compulsary HTML Binding
        // htmlBind = htmlElement.replace("<!-- %%inspection tools%% -->", inspectTool);
        // htmlBind= htmlBind.replace("<!-- %%navigation%% -->", navigation);
        htmlBind= htmlElement.replace("<!-- %%navigation%% -->", navigation);

        let tempObj={
            tempMem: tempMem,
            htmlBind: htmlBind
        }

        return tempObj;
    },




    userNameCopyCheck: ()=>{
        //this function checks if any new account trying to create duplicate username
        
    },

    

}