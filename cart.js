const express = require('express')
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();

const userCart ={}; // This will temporarily store prodId:count till server restarts/crashes

app.use(bodyParser.json());

app.get("/cart", (req, res) => {
  res.send(userCart)
});

app.post("/cart", (req, res) => {
  var pid = req.body.productID;
  var typ = req.body.updateType;
  // var user = req.body.tempUserSession; //to be implemented
  if(userCart[pid]){
    if(typ == "add"){
        userCart[pid]+=1;
    }
    else if(typ == "remove" && userCart[pid]==1){
        delete userCart[pid];
        res.send("ID: "+pid+" removed from the cart!");
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
  res.send("ID: "+pid+" updated with count: "+userCart[pid]);
});

app.listen(PORT,()=>{
    console.log("Cart Service running on PORT:"+PORT);
})