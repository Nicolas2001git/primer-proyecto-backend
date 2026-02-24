import { Router } from "express";
import fs from "fs";
const productsRouter = Router();
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

let products = readFile(productsPath);

const generateProductId = () => {
  if (products.length === 0) return 1;
  let max = 0;
  products.forEach((product) => {
    if (product.id > max) max = product.id;
  });
  return max + 1;
};

productsRouter.get("/", (req, res) => {
  res.send(products);
})

productsRouter.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = products.find((product) => product.id == pid);

  if (product) return res.send(product);

  res.status(404).send({ status: "error", message: "Product not found #" + pid});
});

productsRouter.post("/", (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).send({ status: "error", message: "Missing required fields"});
  }
  const newProduct = {
    id: generateProductId(),
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails ?? []
  };
  products.push(newProduct);
  saveFile(productsPath, products);
  res.status(201).send(newProduct);
});

productsRouter.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const productFound = products.find((product) => product.id == pid);

  if (!productFound) {
    return res.status(404).send({ status: "error", message: "Product not found #" + pid});
  }

  if (req.body.title !== undefined) productFound.title = req.body.title;
  if (req.body.description !== undefined) productFound.description = req.body.description;
  if (req.body.code !== undefined) productFound.code = req.body.code;
  if (req.body.price !== undefined) productFound.price = req.body.price;
  if (req.body.status !== undefined) productFound.status = req.body.status;
  if (req.body.stock !== undefined) productFound.stock = req.body.stock;
  if (req.body.category !== undefined) productFound.category = req.body.category;
  if (req.body.thumbnails !== undefined) productFound.thumbnails = req.body.thumbnails;

  saveFile(productsPath, products);
  res.send(productFound);
});

productsRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  const productExists = products.some((product) => product.id == pid);

  if (!productExists) {
    return res.status(404).send({ status: "error", message: "Product not found #" + pid});
  }

  products = products.filter((product) => product.id != pid);
  saveFile(productsPath, products);
  res.send({ status: "ok", message: "Product deleted #" + pid});
});

export default productsRouter;