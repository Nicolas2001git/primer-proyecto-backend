import express from "express";
import fs from "fs";
const app = express();
const port = 8080;
app.use(express.json());

app.listen(port, () => {
  console.log("Servidor Activo: " + port);
});


const productsPath = "./src/data/products.json";
const cartsPath = "./src/data/carts.json";

function leerArchivo(file) {
  if (!fs.existsSync(file)) return [];
  const data = fs.readFileSync(file, "utf-8");
  if (!data) return [];
  return JSON.parse(data);
}
function guardarArchivo(file, data) {
  fs.writeFileSync(file, JSON.stringify(data));
}
let products = leerArchivo(productsPath);
let carritos = leerArchivo(cartsPath);

const generarIdProductos = () => {
  if (products.length === 0) return 1;
  let max = 0;
  products.forEach((product) => {
    if (product.id > max) max = product.id;
  });
  return max + 1;
};

const generarIdCarritos = () => {
  if (carritos.length === 0) return 1;
  let max = 0;
  carritos.forEach((carrito) => {
    if (carrito.id > max) max = carrito.id;
  });
  return max + 1;
};
app.get("/", (req, res) => {
  res.send("OK");
});
app.get("/api/products", (req, res) => {
  res.send(products);
});
app.get("/api/products/:pid", (req, res) => {
  const { pid } = req.params;
  const product = products.find((product) => product.id == pid);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ status: "error", message: "No existe el Product #" + pid });
  }
});
app.post("/api/products", (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).send({ status: "error", message: "Faltan campos obligatorios" });
  }
  const newProduct = {
    id: generarIdProductos(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails ? thumbnails : []
  };

  products.push(newProduct);
  guardarArchivo(productsPath, products);

  res.status(201).send(newProduct);
});

app.delete("/api/products/:pid", (req, res) => {
  const { pid } = req.params;
  const productfound = products.some((product) => product.id == pid);
  if (!productfound) {
    return res.status(404).send({ status: "error", message: "No existe el Product #" + pid });
  }
  products = products.filter((product) => product.id != pid);
  guardarArchivo(productsPath, products);
  res.send({ status: "ok", message: "Se eliminó el Product #" + pid });
});
app.post("/api/carts", (req, res) => {
  const newCarrito = {
    id: generarIdCarritos(),
    products: []
  };
  carritos.push(newCarrito);
  guardarArchivo(cartsPath, carritos);
  res.status(201).send(newCarrito);
});
app.put("/api/products/:pid", (req, res) => {
  const { pid } = req.params;
  const productfound = products.find((product) => product.id == pid);
  if (!productfound) {
    return res.status(404).send({ status: "error", message: "No existe el Product #" + pid });
  }
  if (req.body.title !== undefined) productfound.title = req.body.title;
  if (req.body.description !== undefined) productfound.description = req.body.description;
  if (req.body.code !== undefined) productfound.code = req.body.code;
  if (req.body.price !== undefined) productfound.price = req.body.price;
  if (req.body.status !== undefined) productfound.status = req.body.status;
  if (req.body.stock !== undefined) productfound.stock = req.body.stock;
  if (req.body.category !== undefined) productfound.category = req.body.category;
  if (req.body.thumbnails !== undefined) productfound.thumbnails = req.body.thumbnails;
  guardarArchivo(productsPath, products);
  res.send(productfound);
});
app.get("/api/carts/:cid", (req, res) => {
  const { cid } = req.params;
  const carrito = carritos.find((carrito) => carrito.id == cid);
  if (!carrito) {
    return res.status(404).send({ status: "error", message: "No existe el carrito #" + cid });
  }
  res.send(carrito.products);
});
app.post("/api/carts/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const carrito = carritos.find((carrito) => carrito.id == cid);
  if (!carrito) {
    return res.status(404).send({ status: "error", message: "No existe el carrito #" + cid });
  }
  const productExists = products.some((product) => product.id == pid);
  if (!productExists) {
    return res.status(404).send({ status: "error", message: "No existe el Product #" + pid });
  }
  const item = carrito.products.find((item) => item.product == pid);
  if (!item) {
    carrito.products.push({ product: pid, quantity: 1 });
  } else {
    item.quantity = item.quantity + 1;
  }
  guardarArchivo(cartsPath, carritos);
  res.send(carrito);
});
