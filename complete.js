//Created Schema
const itemsSchema = new mongoose.Schema({
    name: String,
  });
  
  //Created model
  const Item = mongoose.model("Item", itemsSchema);
  
  //Creating items
  const item1 = new Item({
    name: "Welcome to your todo list.",
  });
  
  const item2 = new Item({
    name: "Hit + button to create a new item.",
  });
  
  const item3 = new Item({
    name: "<-- Hit this to delete an item.",
  });
  
  //Storing items into an array
  const defaultItems = [item1, item2, item3];
  
  const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
  });
  
  
  const List = mongoose.model("List", listSchema);
  
  
  app.get("/", function (req, res) {
    Item.find({})
      .then(function (foundItems) {
        if (foundItems.length === 0) {
          Item.insertMany(defaultItems)
            .then(function () {
              console.log("Successfully saved into our DB.");
            })
            .catch(function (err) {
              console.log(err);
            });
            res.redirect("/");
        }
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  
  app.get("/:customListName", function(req, res){
    const customListName = req.params.customListName;
   
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
  
  
  
  
  app.post("/", function(req, res){
   
    const itemName = req.body.newItem;
    const listName = req.body.listName;
  
    if (!listName) {
      res.redirect("/");
      return;
    }
    
   
    const item = new Item ({
      name: itemName
    });
   
    if (listName === "Today") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
     .then(function (foundList)
       {
         foundList.items.push(item);
         foundList.save();
         res.redirect("/" + listName);
       });
    }
   
  });
  
  
  
  app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.list;
  
    Item.findByIdAndRemove(checkedItemId)
      .then(function () {
        console.log("Item removed Succesfully");
        if (listName === "Today") {
          res.redirect("/");
        } else {
          res.redirect("/" + listName);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });
  
  
  
  app.get("/about", function (req, res) {
    res.render("about");
  });
  
  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });