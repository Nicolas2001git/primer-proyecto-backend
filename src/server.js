import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "../app.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const productsPath = path.join(__dirname, "data", "products.json");

function readProducts() {
  if (!fs.existsSync(productsPath)) return [];
  const data = fs.readFileSync(productsPath, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

function generateProductId(products) {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
}

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Usuario ID: ${socket.id} conectado`);

  socket.emit("productsUpdated", readProducts());

  socket.on("addProduct", (productData) => {
    const products = readProducts();

    const newProduct = {
      id: generateProductId(products),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: true,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: []
    };

    products.push(newProduct);
    saveProducts(products);

    io.emit("productsUpdated", products);
  });

  socket.on("updateProduct", ({ pid, updateData }) => {
  const products = readProducts();
  console.log("Productos actuales:", products);

  const index = products.findIndex((p) => Number(p.id) === Number(pid));
  console.log("Índice encontrado:", index);

  if (index === -1) {
    console.log("Producto no encontrado");
    return;
  }

  if (updateData.price !== undefined) {
    products[index].price = Number(updateData.price);
  }

  if (updateData.stock !== undefined) {
    products[index].stock = Number(updateData.stock);
  }

  console.log("Producto actualizado:", products[index]);

  saveProducts(products);
  io.emit("productsUpdated", products);
});

  

  socket.on("deleteProduct", (pid) => {
    const products = readProducts().filter((product) => product.id != pid);
    saveProducts(products);

    io.emit("productsUpdated", products);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario ID: ${socket.id} desconectado`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}, a la espera`);
});