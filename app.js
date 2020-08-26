const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const app = express();

var Publishable_Key =
  "pk_test_51HKQlmFGggql8fLs2lfSI2cSq0F0cbl1ZYy7RbaxmVuaniIhQOSBCN8ehAeXJp6Km6AdrxmJMq69TjJFUuTwxV5I00OmCSo2f6";
var Secret_Key =
  "sk_test_51HKQlmFGggql8fLsJxMYNoVyFWbUCG5MzMtl5Vun7shd0O6UMW0QKaprqOFFFipKPwSqmeiZC3qNWOT9CuEGN50y00w8TmBavO";

const stripe = require("stripe")(Secret_Key);

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("Home", {
    key: Publishable_Key,
  });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Omar Abusabha",
      address: {
        line1: "Abusabha st",
        postal_code: "452331",
        city: "Gaza",
        state: "Middle East",
        country: "Palestine",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 2500,
        description: "Test Charge",
        currency: "usd",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log("Server created Successfully");
});
