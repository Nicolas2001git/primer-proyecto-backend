import { Router } from "express";
import fs from "fs";
const cartsRouter  = Router();

const cartsPath = "./src/data/carts.json";
const productsPath = "./src/data/products.json";

function readFile(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, "utf-8");
  if (!data) return [];
  return JSON.parse(data);
}

function saveFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}

let carts = readFile(cartsPath);

const generateID = () => {
  if (carts.length === 0) return 1;
  let max = 0;
  carts.forEach((cart) => {
    if (cart.id > max) max = cart.id;
  });
  return max + 1;
};

cartsRouter.post("/", (req, res) => {
  const newCart = {
    id: generateID(),
    products: []
  };
  carts.push(newCart);
  saveFile(cartsPath, carts);
  res.status(201).send(newCart);
});

cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = carts.find((cart) => cart.id == cid);
  if (!cart) {
    return res.status(404).send({ status: "error", message: "Cart not found #" + cid});
    }
  res.send(cart.products);
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const cart = carts.find((cart) => cart.id == cid);
  if (!cart) {
    return res.status(404).send({ status: "error", message: "Cart not found #" + cid});
  }
  const products = readFile(productsPath);
  const productExists = products.some((product) => product.id == pid);
  if (!productExists) {
    return res.status(404).send({ status: "error", message: "Product not found #" + pid});
    }
  const item = cart.products.find((item) => item.product == pid);
  if (!item) {
    cart.products.push({ product: pid, quantity: 1 });
  } else {
    item.quantity = item.quantity + 1;
  }
  saveFile(cartsPath, carts);
  res.send(cart);
});

export default cartsRouter;