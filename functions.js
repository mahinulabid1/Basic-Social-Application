const fs= require('fs');

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
        let userNameCheck= fs.readFileSync(`${__dirname}/database/userinfo.json`);
        userNameCheck= JSON.parse(userNameCheck);

        for(let i=0;i<userNameCheck.length;i++){
            console.log(userNameCheck[i]);

            if(userNameCheck[i].userid===username){
                //this means username matched
                passwordFromData=userNameCheck[i].password;
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
                console.log("password didnt match")
            }
        }

        
    }
}