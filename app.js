const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
_ = require("lodash");
mongoose.connect("mongodb+srv://vikyathrao-admin:test123@cluster0.vhdacwg.mongodb.net/todoListDB")

const nameSchema = {
  name:String
}

const Name = mongoose.model("Name",nameSchema);

const listSchema ={
  name:String,
  items:[nameSchema]
}

const List = mongoose.model("list",listSchema);

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

const defaultItems = [fruits,vegetables,drinks];
let listName = "today";


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({ name: customListName },)
    .then(function(foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save()
          .then(() => {
            res.redirect("/" + customListName);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});


app.get("/",(req,res) =>{

  Name.find().then((foundItems)=>{
    // console.log(foundItems);
    if(foundItems.length === 0){
      Name.insertMany([fruits,vegetables,drinks]).then((err,data)=>{
        if(err){
         console.log(err);
        }else{
         console.log(data);
     }});
     res.redirect("/");
    }else{
      res.render("list",{listTitle:listName,newListItems:foundItems});
    }
  });
  });
  

app.post("/",(req,res)=>{
  let itemToAdd =  req.body.item;
  let listName = req.body.list;

  //  items.push(itemToAdd);
  const item = new Name({
   name:itemToAdd
  });

  if(listName === "today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName}).then((foundList)=>{
       foundList.items.push(item);
       foundList.save();
    });
    res.redirect("/"+listName);
  }
   
  // Name.insertMany([item]).then((err,data)=>{
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log(data);
  //   }
  // });
  
});


app.post("/delete",(req,res)=>{
   let checkBoxId = req.body.checkbox;
   let listName = req.body.hiddenlistTitle;
   

  if(listName === "today"){
    Name.findOneAndDelete({_id:checkBoxId}).then((err)=>{
    res.redirect("/");
   });
}else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkBoxId}}}).then((data)=>{
    res.redirect("/"+listName);
  });
  }
});


let port = process.env.PORT;
if(port == "" || port == null){
  port=3000;
}

app.listen(port,(req,res) =>{
  console.log("U r connected to 3000 port");
});