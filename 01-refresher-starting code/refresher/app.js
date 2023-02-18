const express = require("express");
const bodyParser = require("body-parser");
const practice = require("./mongo");

const app = express();

app.use(bodyParser.json());

app.post("/products", practice.createProduct);

app.get("/products");

app.listen(3000);
