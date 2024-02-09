const express = require('express');
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

const userCarts ={}; // This will temporarily store 'prodId' : 'count' against a 'userid' till server restarts/crashes

app.use(bodyParser.json());

app.get("/cart/:user", (req, res) => {
  const user = req.params.user;
  if(user == "all") // fetches all user carts, only for testing purpose
  {
    res.send(userCarts);
  }
  else{
    const userCart = userCarts[user];
    res.send(userCart)
  }
});

app.post("/cart", (req, res) => {
  var pid = req.body.productID;
  var typ = req.body.updateType;
  var user = req.body.tempUserSession; 

  if(!userCarts[user])
  {
    userCarts[user] = {};
  }
  const userCart = userCarts[user];

  if(userCart[pid]){
    if(typ == "add"){
        userCart[pid]+=1;
    }
    else if(typ == "remove" && userCart[pid]==1){
        delete userCart[pid];
        res.send("ID: "+pid+" removed from the cart for the user: "+user);
    }
    else if(typ == "remove"){
      userCart[pid]-=1;
    }
  }
  else{
    if(typ=="add"){
      userCart[pid]=1;
    }
    else{
      res.send("Cannot remove product as it is unavailable in the cart!");
    }
  }
  res.send("ID: "+pid+" updated with count: "+userCart[pid]+" for user: "+user);
});

app.listen(PORT,()=>{
    console.log("Cart Service running on PORT:"+PORT);
})