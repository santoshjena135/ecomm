const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

const userCarts ={}; // This will temporarily store 'prodId' : 'count' against a 'userid' till server restarts/crashes

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/cart", (req, res) => {
  const user = req.cookies.user_id;
  //const user = req.cookies.user_id;
  if(user === "all") // fetches all user carts, only for testing purpose
  {
    return res.send(userCarts);
  }
  else{
    const userCart = userCarts[user];
    res.send(userCart);
  }
});

app.get("/cart/all", (req, res) => {
  res.send(userCarts); // send all users cart details // TESTING ONLY
});

app.post("/cart", (req, res) => {
  var productId = req.body.productID;
  var updateType = req.body.updateType;
  var user = req.cookies.user_id;

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