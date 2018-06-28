const express = require("express");//导入express框架
const cookie = require("cookie-parser");//导入cookie
const session = require("express-session");//导入session
const router = require("./controller");
const app = express();

const test = require("./controller/test.js");//cheshi

app.set("view engine","ejs");

app.use(cookie());
app.use(session({ secret: '12345', cookie: { maxAge: 1000*60*30 }}));

app.use(express.static("./public"));

app.post("/search",router.Post_search);

app.get("/test",(request,response,next)=>{
	response.render("test");
});

app.get("/login",router.Get_login);
app.post("/login",router.Post_login);

app.get("/",router.Get_index);
app.get("/index",router.Get_index);

app.post("/addThing",router.Post_addThing);
app.get("/deleteThing",router.Get_deleteThing);

app.get("/removeThing",router.Get_removeThing);

app.post("/addList",router.Post_addList);
app.get("/deleteList",router.Get_deleteList);


app.get("/logout",(request,response,next)=>{
	request.session.userName = null;
	response.writeHead(302,{"Location":"http://127.0.0.1:3000/login?tip=3"});
	response.end();
});


app.listen(3000);
console.log("The server is started at '127.0.0.1:3000'");
