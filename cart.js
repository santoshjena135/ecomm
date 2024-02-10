const express = require('express');
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

const userCarts ={}; // This will temporarily store 'prodId' : 'count' against a 'userid' till server restarts/crashes

app.use(bodyParser.json());

app.get("/cart/:user", (req, res) => {
  const user = req.params.user;
  if(user === "all") // fetches all user carts, only for testing purpose
  {
    return res.send(userCarts);
  }
  else{
    const userCart = userCarts[user];
    res.send(userCart);
  }
});

app.post("/cart", (req, res) => {
  var productId = req.body.productID;
  var updateType = req.body.updateType;
  var user = req.body.tempUserSession; 

  if (!productId || !updateType || !user) {
    return res.status(400).send("Missing required parameters");
  }

  if(!userCarts[user])
  {
    userCarts[user] = {};
  }
  const userCart = userCarts[user];

  if(userCart[productId]){
    if(updateType === "add"){
        userCart[productId]+=1;
    }
    else if(updateType === "remove" && userCart[productId]==1){
        delete userCart[productId];
        return res.send("ID: "+productId+" removed from the cart for the user: "+user);
    }
    else if(updateType === "remove"){
      userCart[productId]-=1;
    }
  }
  else{
    if(updateType === "add"){
      userCart[productId]=1;
    }
    else{
      return res.status(400).send("Cannot remove product as it is unavailable in the cart!");
    }
  }
  res.send("ID: "+productId+" updated with count: "+userCart[productId]+" for user: "+user);
});

app.listen(PORT,()=>{
    console.log("Cart Service running on PORT:"+PORT);
})