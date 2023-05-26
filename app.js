const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

const nameSchema = {
  name:String
}

const Name = mongoose.model("Name",nameSchema);

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const fruits = new Name({
  name: "buy fruits"
});
  
const vegetables = new Name({
  name:"Buy vegetables"
});

const drinks = new Name({
   name:"buy drinks"
});


const defaultItems = [];
// Name.insertMany([fruits,vegetables,drinks]).then((err,data)=>{
//    if(err){
//     console.log(err);
//    }else{
//     console.log(data);
// }});
Name.find().then((data)=>{
  console.log(data);
});
app.get("/",(req,res) =>{

 

  res.render("list",{kindofday:"Today",listitems:defaultItems});
});

app.post("/",(req,res)=>{
  var itemToAdd =  req.body.item;
   items.push(itemToAdd);
  res.redirect("/");
});



app.listen(3000,(req,res) =>{
  console.log("U r connected to 3000 port");
});