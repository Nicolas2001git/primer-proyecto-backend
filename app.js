import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import { ProductModel } from "./src/models/product-model.js";
import { CartModel } from "./src/models/cart-model.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src", "views", "layouts"),
    partialsDir: path.join(__dirname, "src", "views", "partials"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views", "pages"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render("realtimeproducts", { products });
});

app.get("/products", async (req, res) => {
  let { limit = 10, page = 1, sort, query } = req.query;

  limit = Number(limit);
  page = Number(page);

  const filter = {};

  if (query) {
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else {
      filter.category = query;
    }
  }

  let products = await ProductModel.find(filter).lean();

  if (sort === "asc") {
    products.sort((a, b) => a.price - b.price);
  }

  if (sort === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const productsResult = products.slice(start, end);

  const totalPages = Math.ceil(products.length / limit) || 1;

  res.render("products", {
    products: productsResult,
    page,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null
  });
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).send("ID inválido / Invalid ID");
  }

  const product = await ProductModel.findById(pid).lean();

  if (!product) {
    return res.status(404).send("Producto no encontrado / Product not found");
  }

  res.render("productDetail", { product });
});

app.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).send("ID inválido / Invalid ID");
  }

  let cart = await CartModel.findById(cid)
    .populate("products.product");

  if (!cart) {
    return res.status(404).send("Carrito no encontrado / Cart not found");
  }

  const originalLength = cart.products.length;

  cart.products = cart.products.filter(
    (item) => item.product !== null
  );

  if (cart.products.length !== originalLength) {
    await cart.save();
  }

  cart = cart.toObject();

  res.render("cart", { cart });
});

export default app;