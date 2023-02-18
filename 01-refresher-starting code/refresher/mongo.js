const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://igordbauer:bnkNW4Bku4BJ7C6R@cluster0.mkk7l8p.mongodb.net/products?retryWrites=true&w=majority";

const createProduct = async (req, res, next) => {
  const { name, price } = req.body;
  const newProduct = { name, price };
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = db.collection("products").insertOne(newProduct);
  } catch (error) {
    return res.json({ message: "nao deu" });
  }
  client.close();
  res.json(newProduct);
};
const getProduct = async (req, res, next) => {};

exports.createProduct = createProduct;
exports.getProduct = getProduct;
