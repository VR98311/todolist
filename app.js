const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/todolistDB")

const nameSchema = {
  name:String
}

const names = mongoose.model("name",nameSchema);

 var items = [];
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",(req,res) =>{

  var today = new Date(); 

  var options = {
    weekday:"long",
    day:"numeric",
    month:"long",
  }

  var day = today.toLocaleDateString("en-US",options);

  res.render("list",{kindofday:day,listitems:items});
});

app.post("/",(req,res)=>{
  var itemToAdd =  req.body.item;
   items.push(itemToAdd);
  res.redirect("/");
});



app.listen(3000,(req,res) =>{
  console.log("U r connected to 3000 port");
});