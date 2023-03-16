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
    }
}