import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, "src/data/products.json");

function readProducts() {
  if (!fs.existsSync(productsPath)) return [];
  const data = fs.readFileSync(productsPath, "utf-8");
  return data ? JSON.parse(data) : [];
}

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

app.get("/", (req, res) => {
  const products = readProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  const products = readProducts();
  res.render("realtimeproducts", { products });
});

export default app;